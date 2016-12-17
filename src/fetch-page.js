import Promise from 'bluebird';
import Nightmare from 'nightmare';

import log from './utils/log-wrapper.js';

const scraperOptions = {};

const fetchPage = (directive, cfgOptions = {}, emitter) => {
    emitter.emit('scrapingStart', directive.url);
    log.verbose(`Fetching page content from ${directive.url}...`);
    log.debug('directive', directive);

    const nightmare = Nightmare(Object.assign({}, scraperOptions, cfgOptions)); // eslint-disable-line

    return new Promise((resolve) => nightmare
        .goto(directive.url)
        .evaluate((directive) => {
            const nodeData = document.querySelectorAll(directive.elem);
            const stringData = Array.prototype.map.call(nodeData, dataItem => dataItem.outerHTML);

            return stringData;
        }, directive)
        .end()
        .then(data => {
            emitter.emit('scrapingEnd', data);
            log.verbose(`Fetching page content from ${directive.url} done!`);
            log.info(`${directive.url}: ${data.length} news scraped`);
            log.debug('data', data);

            directive.data = data;
            resolve(directive);

            return data;
        })
        .catch(err => {
            emitter.emit('scrapingError', err);
            log.warn(`Oops, something happened: ${err}`);
            log.warn(`${directive.url}: ${err.message}`);
            log.info(`${directive.url}: 0 news scraped`);

            directive.data = [];
            resolve(directive);
        })
    );
};

export default fetchPage;
