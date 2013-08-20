module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		qunit: {
			all: ['test/**/*.html']
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-qunit');
};
