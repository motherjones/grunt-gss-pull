/*
 * grunt-gss-pull
 * https://github.com/motherjones/grunt-gss-pull
 *
 * Copyright (c) 2013 Ben Breedlove
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    gss_pull: {
      super_simple: {
        options: {
        },
        files: {
          'tmp/super_simple': ['0AswaDV9q95oZdE4wVHFZYXlic0tHaU5QNWRqYzUxU0E'],
        },
      },
      single_sheet: {
        options: {
        },
        files: {
          'tmp/single_sheet': ['response://docs.google.com/spreadsheet/pub?key=0AiK02J6OppqxdE5ycWRNOXJyNk40WXBrS2JGUUdRUHc&output=html'],
        },
      },
      multi_sheet: {
        options: {
        },
        files: {
          'tmp/multi_sheet': [
              'https://docs.google.com/spreadsheet/pub?key=0AswaDV9q95oZdE4wVHFZYXlic0tHaU5QNWRqYzUxU0E&output=html',
              'https://docs.google.com/spreadsheet/pub?key=0AswaDV9q95oZdHpOX2s2MmpsNXR1RXRqNDEtS0FiV1E&output=blah'
          ],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'gss_pull', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
