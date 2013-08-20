module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
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
	
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
