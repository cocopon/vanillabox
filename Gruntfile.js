module.exports = function(grunt) {
	'use strict';

	var baseJsFiles = function() {
		return [
			'src/js/global.js',
			'src/js/util.js',
			'src/js/events.js',
			'src/js/exception.js',
			'src/js/animation.js',
			'src/js/animationprovider.js',
			'src/js/mask.js',
			'src/js/container.js',
			'src/js/frame.js',
			'src/js/content.js',
			'src/js/contentfactory.js',
			'src/js/pager.js',
			'src/js/button.js',
			'src/js/label.js',
			'src/js/vanillabox.js',
			'src/js/main.js'
		];
	};

	var prodJsFiles = baseJsFiles();
	prodJsFiles.push('src/js/exports.js');

	var devJsFiles = baseJsFiles();
	devJsFiles.push('src/js/test.js');

	grunt.initConfig({
		env: process.env,
		pkg: grunt.file.readJSON('package.json'),

		clean: [
			'vanillabox/jquery.vanillabox.js',
			'vanillabox/jquery.vanillabox-*.min.js'
		],
		'closure-compiler': {
			frontend: {
				js: prodJsFiles,
				jsOutputFile: 'vanillabox/jquery.vanillabox-<%= pkg.version %>.min.js',
				noreport: true,
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS',
					externs: [
						'<%= env.CLOSURE_PATH %>/contrib/externs/jquery-1.7.js'
					],
					output_wrapper: '(function($){%output%})(jQuery);'
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
					'CHANGES.txt',
					'LICENSE.txt',
					'README.md',
					'vanillabox/**'
				]
			}
		},
		exec: {
			combine: {
				cmd: function() {
					return [
						'OUTPUT_JS=vanillabox/jquery.vanillabox.js',
						'echo "(function($) {" > $OUTPUT_JS',
						'cat ' + devJsFiles.join(' ') + '>> $OUTPUT_JS',
						'echo "})(jQuery);" >> $OUTPUT_JS'
					].join(';');
				}
			}
		},
		jsdoc: {
			dist: {
				src: ['src/js/*.js'],
				options: {
					destination: 'jsdoc'
				}
			}
		},
		qunit: {
			all: ['test/**/*.html']
		},
		sass: {
			document: {
				files: {
					'doc/style.css': 'src/css/doc/style.scss'
				},
				options: {
					style: 'expanded'
				}
			},
			theme: {
				files: {
					'vanillabox/theme/bitter/vanillabox.css': 'src/css/theme/bitter/bitter.scss',
					'vanillabox/theme/bitter_frame/vanillabox.css': 'src/css/theme/bitter_frame/bitter_frame.scss',
					'vanillabox/theme/sweet/vanillabox.css': 'src/css/theme/sweet/sweet.scss',
					'vanillabox/theme/sweet_frame/vanillabox.css': 'src/css/theme/sweet_frame/sweet_frame.scss'
				},
				options: {
					require: './src/css/lib/vanillabox.rb',
					style: 'expanded'
				}
			}
		},
		watch: {
			css: {
				files: 'src/css/**/*.scss',
				tasks: ['sass']
			},
			js: {
				files: 'src/js/**/*.js',
				tasks: ['combine']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('combine', ['exec:combine']);
	grunt.registerTask('compile', ['sass:theme', 'closure-compiler']);
	grunt.registerTask('document', ['sass:document', 'combine']);
	grunt.registerTask('package', ['clean', 'compile', 'document', 'compress']);

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('test', ['combine', 'qunit']);
};
