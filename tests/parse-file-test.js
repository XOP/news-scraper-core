var path = require('path');

var test = require('tape');

var parseFile = require('../lib/utils/parse-file.js');

var dataPath = path.resolve(__dirname, 'fixtures/data');

test('Parse file test', function (t) {

    var jsonPath = path.join(dataPath, 'data.json');
    var ymlPath = path.join(dataPath, 'data.yml');
    var yamlPath = path.join(dataPath, 'data.yaml');
    var txtPath = path.join(dataPath, 'data.txt');

    t.deepEqual(
        parseFile(jsonPath),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse JSON file'
    );

    t.deepEqual(
        parseFile(ymlPath),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse YML file'
    );

    t.deepEqual(
        parseFile(yamlPath),

        {
            Foo: {
                bar: 'one',
                baz: 'two',
                bam: 'three'
            }
        },

        'Should parse YAML file'
    );

    t.equal(
        parseFile(txtPath),

        null,

        'Should not parse file with unsupported format'
    );


    t.end();
});
