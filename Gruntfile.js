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
					'vanillabox/theme/bitter/vanillabox.css': 'src/theme/bitter/bitter.scss',
					'vanillabox/theme/bitter_frame/vanillabox.css': 'src/theme/bitter_frame/bitter_frame.scss'
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-sass');
};
