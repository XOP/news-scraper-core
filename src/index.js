import events from 'events';
import Promise from 'bluebird';

import fetchPage from './fetch-page.js';
import limitData from './limit-data.js';
import refineData from './refine-data.js';
import compareData from './compare-data.js';

import log from './utils/log-wrapper.js';

const ScraperEmitter = events.EventEmitter;

const scraper = (directives, cfg, debugStage = '') => {
    const emitter = new ScraperEmitter();

    // fetch page data
    const scrapedData = Promise.mapSeries(directives, (directive) => {
        return fetchPage(directive, cfg.scraperOptions, emitter);
    });

    if (debugStage === 'data') {
        return;
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

    if (debugStage === 'limit') {
        return;
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

    if (debugStage === 'refine') {
        return;
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

    if (debugStage === 'compare') {
        return;
    }

    return {
        events: emitter,
        data: currentData
    };
};

export default scraper;
