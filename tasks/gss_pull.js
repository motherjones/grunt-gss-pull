/*
 * grunt-gss-pull
 * https://github.com/motherjones/grunt-gss-pull
 *
 * Copyright (c) 2013 Ben Breedlove
 * Licensed under the MIT license.
 */

'use strict';
var http = require('http');
var Promise = require('node-promise');

module.exports = function(grunt) {

    // Please see the grunt documentation for more information regarding task
    // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md

    grunt.registerMultiTask('gss_pull', 'Your task description goes here.', function() {
        var done = this.async();
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
        });
        var gss_fetch = function(url, key) {
            var promise = new Promise.Promise();
            http.get(url, function(res) {
                var response_data = '';
                res.on('error', function(e) {
                    promise.reject("Got error: " + e.message);
                });
                res.on('data', function(data) {
                    response_data += data;
                });
                res.on('end', function(data) {
                    var data = JSON.parse(response_data);
                    var more_promises = [];
                    for (var i = 0; i < data.feed.entry.length; i++) {
                        more_promises.push( fetch_each_sheet(data.feed.entry[i], key) );
                    }
                    Promise.all( more_promises ).then(function(results) {
                        var resolvable = {};
                        if (results.length > 1) {
                            resolvable[data.feed.title.$t] = {};
                            for (var i=0; i < results.length; i++) {
                                var key = Object.keys(results[i])[0];
                                resolvable[data.feed.title.$t][key] = results[i][key];
                            }
                            promise.resolve(resolvable);
                        } else if (results.length === 1) {
                            var key = Object.keys(results[0])[0];
                            resolvable[data.feed.title.$t] = results[0][key];
                            promise.resolve(resolvable);
                        } else {
                            promise.reject("Bad return from spreadsheets: " + results);
                        }

                    });
                });
            });
            return promise;
        };

        var fetch_each_sheet = function(sheet, key) {
            var promise = new Promise.Promise();
            var sheet_id = sheet.link[3].href.substr( 
                sheet.link[3].href.length - 3, 3
            );
            var url = "http://spreadsheets.google.com/feeds/list/" + key + "/" + sheet_id + "/public/values?alt=json";
            http.get(url, function(res) {
                var response_data = '';
                res.on('error', function(e) {
                    promise.reject("Got error: " + e.message);
                });
                res.on('data', function(data) {
                    response_data += data;
                });
                res.on('end', function(data) {
                    var data = JSON.parse(response_data);
                    var returnable = {};
                    returnable[sheet.content.$t] = parse_gdoc_data(data.feed.entry);
                    promise.resolve(returnable);
                });
            });
            return promise;
        };

        var parse_gdoc_data = function(raw) {
           var column_names = [];
           var elements = [];
           for (var key in raw[0]) {
               if(/^gsx/.test(key)) {
                   column_names.push( key.replace("gsx$","") );
               }
           }

           for (var i = 0; i < raw.length; i++) {
               var element = {};
               for (var j = 0; j < column_names.length; j++) {
                   var cell = raw[i][ "gsx$" + column_names[j] ];
                   if (cell.$t !== '' && !isNaN(cell.$t)) {
                     element[ column_names[j] ] = +cell.$t;
                   } else {
                     element[ column_names[j] ] = cell.$t;
                   }
               }
               if(element.rowNumber === undefined) { 
                   element.rowNumber = i + 1;
               }
               elements.push(element);
           }
           return elements;
        };

        // Iterate over all specified file groups.
        this.files.forEach(function(fileObj) {
            // The source files to be concatenated. The "nonull" option is used
            // to retain invalid files/patterns so they can be warned about.
            ///grunt.file.expand({nonull: true}, fileObj.src);

            var spreadsheets = (fileObj.orig.src);
            // Concat specified files.
            var promises = [];
            var json = spreadsheets.map(function(spreadsheetKey) {
                if(/key=/.test(spreadsheetKey)) {
                    spreadsheetKey = spreadsheetKey.match("key=(.*?)&")[1];
                }
                if (!spreadsheetKey) {
                    grunt.log.error('Could not find spreadsheet key from "' + fileObj.src );
                }
                var json_url = "http://spreadsheets.google.com/feeds/worksheets/"
                + spreadsheetKey + "/public/basic?alt=json";

                var promise = gss_fetch( json_url, spreadsheetKey);
                promises.push( promise );

            })

            Promise.all( promises ).then(function(results) {
            // Write the destination file.
                if (results.length === 1) {
                    grunt.file.write(fileObj.dest, JSON.stringify(results[0])
                    );
                } else {
                    var object_to_write = {};
                    for (var i=0; i < results.length; i++) {
                        var key = Object.keys(results[i])[0];
                        object_to_write[key] = results[i][key];
                    }
                    grunt.file.write(fileObj.dest, JSON.stringify(object_to_write)
                    );
                }

                // Print a success message.
                grunt.log.writeln('File "' + fileObj.dest + '" created.');
                done();
            }, function( error ) {
                console.log('Error getting spreadsheets: ' + error.message);
                done();
            });

        });
    });

};
