var test = require('tape');

var limitData = require('../lib/limit-data.js');

var scrapedData = [];

//
// hardcoded limit value = 5
//

test('Source object limit links test', function (t) {
    //
    // default limit

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-3</a>',
                '<a href="#1-4">Link 1-4</a>',
                '<a href="#1-5">Link 1-5</a>',
                '<a href="#1-6">Link 1-6</a>',
                '<a href="#1-7">Link 1-7</a>'
            ]
        }
    ];

    t.deepEqual(
        limitData(scrapedData),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>',
                    '<a href="#1-3">Link 1-3</a>',
                    '<a href="#1-4">Link 1-4</a>',
                    '<a href="#1-5">Link 1-5</a>'
                ]
            }
        ],

        'Should return limited links using default hardcoded value'
    );

    //
    // general limit

    t.deepEqual(
        limitData(scrapedData, 3),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>',
                    '<a href="#1-3">Link 1-3</a>'
                ]
            }
        ],

        'Should return limited links using config setting'
    );

    //
    // individual limit

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-3</a>',
                '<a href="#1-4">Link 1-4</a>'
            ],
            limit: 2
        }
    ];

    t.deepEqual(
        limitData(scrapedData, 3),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>'
                ],
                limit: 2
            }
        ],

        'Should return limited links using individual setting ignoring general limit'
    );

    t.deepEqual(
        limitData(scrapedData),

        [
            {
                title: 'Title 1',
                data: [
                    '<a href="#1-1">Link 1-1</a>',
                    '<a href="#1-2">Link 1-2</a>'
                ],
                limit: 2
            }
        ],

        'Should return limited links using individual setting ignoring default limit'
    );

    //
    // limit is higher

    scrapedData = [
        {
            title: 'Title 1',
            data: [
                '<a href="#1-1">Link 1-1</a>',
                '<a href="#1-2">Link 1-2</a>',
                '<a href="#1-3">Link 1-2</a>',
                '<a href="#1-4">Link 1-2</a>'
            ]
        }
    ];

    t.deepEqual(
        limitData(scrapedData, 6),
        scrapedData,

        'Should return same object if limit is higher than links amount'
    );

    t.end();
});
