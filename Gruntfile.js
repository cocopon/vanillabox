module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'closure-compiler': {
			frontend: {
				js: 'vanillabox/jquery.vanillabox.js',
				jsOutputFile: 'vanillabox/jquery.vanillabox-<%= pkg.version %>.min.js',
				noreport: true,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS'
				}
			}
		},
		jsdoc: {
			dist: {
				src: ['vanillabox/jquery.vanillabox.js'],
				options: {
					destination: 'doc'
				}
			}
		},
		qunit: {
			all: ['test/**/*.html']
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'demo/style.css': 'src/demo/style.scss',
					'vanillabox/theme/bitter/vanillabox.css': 'src/theme/bitter/bitter.scss',
					'vanillabox/theme/bitter_frame/vanillabox.css': 'src/theme/bitter_frame/bitter_frame.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'src/**/*.scss',
				tasks: ['sass']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
};
