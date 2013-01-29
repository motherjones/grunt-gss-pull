'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.gss_pull = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  super_simple: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/super_simple');
    var expected = grunt.file.read('test/expected/super_simple');
    test.equal(actual, expected, 'should pull a single spreadsheet with a single spreadsheet');

    test.done();
  },
  single_sheet: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/single_sheet');
    var expected = grunt.file.read('test/expected/single_sheet');
    test.equal(actual, expected, 'should pull a single spreadsheet with two worksheets');

    test.done();
  },
  multi_sheet: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/multi_sheet');
    var expected = grunt.file.read('test/expected/multi_sheet');
    test.equal(actual, expected, 'should pull two sheets, one with two worksheets, one with a single worksheet.');

    test.done();
  },
};
