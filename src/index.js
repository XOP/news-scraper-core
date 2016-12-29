import events from 'events';
import Promise from 'bluebird';

import fetchPage from './fetch-page.js';
import limitData from './limit-data.js';
import refineData from './refine-data.js';
import compareData from './compare-data.js';

import log from './utils/log-wrapper.js';

const ScraperEmitter = events.EventEmitter;

class Scraper {
    constructor (directives, cfg, state = 'process') {
        this.directives = directives;
        this.cfg = cfg;
        this.emitter = new ScraperEmitter();
        this._state = state;
    }

    get state () {
        return this._state;
    }

    set state (newState) {
        this._state = newState;
    }

    get events () {
        return this.emitter;
    }

    get data () {
        const _this = this;
        const cfg = _this.cfg;
        const directives = _this.directives;
        const emitter = _this.emitter;
        const state = _this.state;

        // fetch page data
        const scrapedData = Promise.mapSeries(directives, (directive) => {
            const state = _this.state;

            if (state === 'abort') {
                return new Promise.resolve(Object.assign(directive, { data: [] })); // eslint-disable-line
            } else {
                return fetchPage(directive, cfg.scraperOptions, emitter);
            }
        });

        if (state === 'data') {
            return scrapedData;
        }

        // limit data
        const limitedData = scrapedData
            .then(scrapedData => {
                emitter.emit('scrapingDone', scrapedData);
                log.debug('scraped data', scrapedData);

                return limitData(scrapedData, cfg.limit);
            })
            .catch(err => {
                log.error(err);
            });

        if (state === 'limit') {
            return limitedData;
        }

        // refine data
        const refinedData = limitedData
            .then(limitedData => {
                emitter.emit('limitingDone', limitedData);
                log.debug('limited data', limitedData);

                return refineData(limitedData);
            })
            .catch(err => {
                log.error(err);
            });

        if (state === 'refine') {
            return refinedData;
        }

        // compare to previous data
        const currentData = refinedData
            .then(refinedData => {
                emitter.emit('refiningDone', refinedData);
                log.debug('refined data', refinedData);

                if (typeof cfg.updateStrategy !== 'undefined') {
                    return compareData(refinedData, cfg.output.path, cfg.output.current, cfg.updateStrategy);
                } else {
                    return refinedData;
                }
            })
            .catch(err => {
                log.error(err);
            });

        if (state === 'compare') {
            return currentData;
        }

        return currentData;
    }
}

export default Scraper;
