var events = require('events');
var test = require('tape');

var fetchPage = require('../lib/fetch-page.js');

var Emitter = events.EventEmitter;
var testEmitter = new Emitter();

var props = {
    url: 'http://ponyfoo.com/',
    elem: '.aa-article',
    link: 'h2.aa-title > a'
};

test('Fetch page test', function (t) {
    var pagePromise = fetchPage(props, {}, testEmitter);

    pagePromise
        .then(function (result) {
            t.ok(result.data, 'Parsing success');
            t.end();
        })
        .catch(function (err) {
            t.notok(err, 'Error occurred');
            t.end();
        });
});
