/*!
 * grunt-svg2png
 * https://github.com/dbushell/grunt-svg2png
 *
 * Copyright (c) 2013 David Bushell
 * Licensed under The MIT License (MIT)
 */

'use strict';

module.exports = function(grunt)
{
    var fs = require('fs'),
        path = require('path'),
        checksum = require('checksum'),
        stamp = {};

    fs.exists('stamp.json', function(exists) {
        if (exists) {
            stamp = JSON.parse(fs.readFileSync('stamp.json', 'utf8'));
        }
    });

    function onlyChanged(filepath) {
        var file = path.resolve(filepath);

        return stamp[file] !== checksum(file);
    }

    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            tests: ['test/**/*.png']
        },

        nodeunit: {
            tests: ['test/*_test.js']
        },

        svg2png: {
            all: {
                files: [
                    { src: ['test/**/*.svg'], dest: 'test/png/' }
                ]
            },
            filtered: {
                options: {
                    stamp: 'stamp.json'
                },
                files: [
                    { src: ['test/**/*.svg'], dest: 'test/png/', filter: onlyChanged }
                ],
            }
        }

    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'svg2png', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
