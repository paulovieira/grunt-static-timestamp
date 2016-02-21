/*
 * grunt-static-timestamp
 * https://github.com/pvieira/grunt-static-timestamp
 *
 * Copyright (c) 2016 Paulo Vieira
 * Licensed under the MIT license.
 */

 var Path = require("path");
 var Crypto = require('crypto');

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('static-timestamp', 'Add a timestamp to the static files, but only if files have actually changed', function() {

        //console.log("this.files: ", JSON.stringify(this.files, null, 4));

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({});

        var updated = [];
        this.files.forEach(function(file) {

            var tempHashes = {},
                publicHashes = {};

            if (!grunt.file.exists(file.dest)) {
                grunt.fail.fatal("Destination does not exist: " + file.dest);
            }

            if (!grunt.file.isDir(file.dest)) {
                grunt.fail.fatal("Destination must be a directory: " + file.dest);
            }

            // compute md5 hash for the src files
            file.src.forEach(function(path) {

                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + path + '" not found.');
                    return;
                }

                computeHash(path, tempHashes);
            });

            // compute md5 files for files in the dest dir
            var publicFiles = grunt.file.expand({ filter: "isFile" }, Path.join(file.dest, "*"));

            publicFiles.forEach(function(path) {
                computeHash(path, publicHashes);
            });

            var pairs = [];

            // find the corresponding pairs between temp files and public files; this is
            // done by simply comparing the file names (the timestamp is removed from the 
            // files in the public files); it might happen that for a given temp file there
            // is no corresponding build file yet;
            for (var tempFile in tempHashes) {

                var pair = {};
                pair[tempFile] = tempHashes[tempFile];

                var tempName = Path.parse(tempFile).name;

                for (var publicFile in publicHashes) {

                    var publicName = Path.parse(publicFile).name.split(".").slice(1).join(".");
                    if (publicName === tempName) {
                        pair[publicFile] = publicHashes[publicFile];
                    }
                }

                pairs.push(pair);
            }

            //console.log("pairs:\n", pairs);

            // verify if the md5 of the pairs match; if not, replace the public file with the corresponding temp file
            pairs.forEach(function(pair) {

                var paths = Object.keys(pair);

                if (paths.length === 1 ||
                    paths.length === 2 && pair[paths[0]] !== pair[paths[1]]) {

                    var now = grunt.template.today('yymmdd-HHMMss');

                    // paths[0] is always the temp file
                    var newBuildFile = Path.join(file.dest, now + "." + Path.parse(paths[0]).name + Path.parse(paths[0]).ext);

                    grunt.file.copy(paths[0], newBuildFile);
                    updated.push(newBuildFile)

                    if (paths.length === 2) {
                        grunt.file.delete(paths[1], { force: true });
                    }
                }

            });

        });

        if (updated.length === 0) {
            grunt.log.writeln("no changes detected (everything up to date)");
        } else {
            grunt.log.writeln("updated timestamps:");
            grunt.log.writeln(grunt.log.wordlist(updated, { separator: "\n" }));
        }


        function computeHash(path, obj) {

            // encoding is null, so returns a Buffer instead of a string
            var source = grunt.file.read(path, {
                encoding: null
            });

            var hash = Crypto
                .createHash("md5")
                .update(source)
                .digest("hex");

            obj[path] = hash;
        }

    });

};
