module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		env: process.env,
		pkg: grunt.file.readJSON('package.json'),

		clean: ['vanillabox/jquery.vanillabox-*.min.js'],
		'closure-compiler': {
			frontend: {
				js: 'vanillabox/jquery.vanillabox.js',
				jsOutputFile: 'vanillabox/jquery.vanillabox-<%= pkg.version %>.min.js',
				noreport: true,
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS',
					externs: [
						'<%= env.CLOSURE_PATH %>/contrib/externs/jquery-1.7.js'
					]
				}
			}
		},
		compress: {
			main: {
				options: {
					archive: 'vanillabox-<%= pkg.version %>.zip'
				},
				src: [
					'doc/**',
					'LICENSE.txt',
					'README.md',
					'vanillabox/**'
				]
			}
		},
		jsdoc: {
			dist: {
				src: ['vanillabox/jquery.vanillabox.js'],
				options: {
					destination: 'jsdoc'
				}
			}
		},
		qunit: {
			all: ['test/**/*.html']
		},
		sass: {
			dist: {
				files: {
					'doc/style.css': 'src/css/doc/style.scss',
					'vanillabox/theme/bitter/vanillabox.css': 'src/css/theme/bitter/bitter.scss',
					'vanillabox/theme/bitter_frame/vanillabox.css': 'src/css/theme/bitter_frame/bitter_frame.scss',
					'vanillabox/theme/sweet/vanillabox.css': 'src/css/theme/sweet/sweet.scss',
					'vanillabox/theme/sweet_frame/vanillabox.css': 'src/css/theme/sweet_frame/sweet_frame.scss'
				},
				options: {
					require: 'src/css/lib/vanillabox.rb',
					style: 'expanded'
				}
			}
		},
		watch: {
			css: {
				files: 'src/css/**/*.scss',
				tasks: ['sass']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('compile', ['sass', 'closure-compiler']);
	grunt.registerTask('package', ['clean', 'compile', 'compress']);
};
