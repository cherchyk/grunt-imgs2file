/*
 * grunt-imgs2file
 * https://github.com/cherchyk/grunt-imgs2file
 *
 * Copyright (c) 2017 Bohdan Cherchyk
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint_old: {
			all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			src: {
				src: ['src/**/*.*']
			},
			test: {
				src: ['test-src/**/*.*']
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			all: ['tmp', 'tasks/**/*'],
			tests: ['tmp'],
			ts: ['tasks/.baseDir*']
		},

		// Configuration to be run (and then tested).
		imgs2file: {
			default_options: {
				options: {
				},
				files: {
					'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
				}
			},
			custom_options: {
				options: {
					separator: ': ',
					punctuation: ' !!!'
				},
				files: {
					'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
				}
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		},

		ts: {
			app: {
				files: [{
					src: ['src/**/*.ts', '!src/.baseDir.ts'],
					dest: 'tasks'
				}],
				options: {
					module: "commonjs",
					noLib: false,
					target: "es6",
					sourceMap: true
				}
			}
		},

		tslint: {
			src: {
				options: {
					configuration: "tslint.json"
				},
				files: {
					src: [
						"src/**/*.ts"
					]
				}
			},
			test: {
				options: {
					configuration: "tslint.json"
				},
				files: {
					src: [
						"test-src/**/*.ts",
						"!test-src/routes/**/*.ts"
					]
				}
			}
		},

		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: ['<%= jshint.src.src %>', '<%= jshint.test.src %>'],
				tasks: ['clean:all', 'ts', 'clean:ts', 'tslint:src']
			},
			srcandtest: {
				files: ['<%= jshint.src.src %>', '<%= jshint.test.src %>'],
				tasks: ['ts', 'copy:source', 'copy:test', 'copy:testsrc', 'clean:ts', 'tslint', 'nodeunit']
			}

		},

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks("grunt-tslint");

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean:tests', 'imgs2file', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['clean:all', 'ts', 'clean:ts']); //, 'test'
	grunt.registerTask('dw', ['default', 'watch:src']);

};
