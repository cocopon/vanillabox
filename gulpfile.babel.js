const pkg = require('./package.json');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const sassFunctions = require('./src/css/lib/vanillabox.js');
const runSequence = require('run-sequence');

require('babel/register');

const THEMES = ['bitter', 'bitter_frame', 'sweet', 'sweet_frame'];

gulp.task('clean', () => {
	return del([
		'./vanillabox/jquery.vanillabox.js',
		'./vanillabox/jquery.vanillabox-*.min.js',
		'./vanillabox/theme/**/*.css'
	]);
});

gulp.task('compress', () => {
	return gulp.src([
			'doc/**',
			'CHANGES.txt',
			'LICENSE.txt',
			'README.md',
			'vanillabox/**'
		])
		.pipe($.zip(`vanillabox-${pkg.version}.zip`))
		.pipe(gulp.dest('./'));
});

gulp.task('jsdoc', () => {
	// TODO:
	// return gulp.src('src/js/**/*.js')
	// 	.pipe($.jsdoc('./jsdoc'));
});

[false, true].forEach((production) => {
	const postfix = production ? ':dist' : '';
	const dstName = production ?
		`jquery.vanillabox-${pkg.version}.min.js` :
		'jquery.vanillabox.js';

	gulp.task(`js${postfix}`, () => {
		return browserify('./src/js/main.js')
			.transform(babelify.configure({
				compact: production
			}))
			.bundle()
			.on('error', (e) => {console.log(`Error: ${e.message}`);})
			.pipe(source(dstName))
			.pipe(buffer())
			.pipe(production ? $.uglify() : $.nop())
			.pipe($.header(
				[
					'/**',
					' * @license Vanillabox',
					' * (C) 2013 cocopon.',
					' *',
					' * Licensed under the MIT license:',
					' * http://www.opensource.org/licenses/mit-license.php',
					' */'
				].join('\n')
			))
			.pipe(gulp.dest('./vanillabox'));
	});
});

gulp.task('qunit', () => {
	return gulp.src('./test/index.html')
		.pipe($.qunit());
});

THEMES.forEach((theme) => {
	gulp.task(`sass:theme_${theme}`, () => {
		return gulp.src(`./src/css/theme/${theme}/${theme}.scss`)
			.pipe($.sass({
				functions: sassFunctions,
				outputStyle: 'expanded'
			}))
			.pipe($.autoprefixer({browsers: [
				'last 5 iOS versions',
				'last 5 ChromeAndroid versions'
			]}))
			.pipe($.rename('vanillabox.css'))
			.pipe(gulp.dest(`./vanillabox/theme/${theme}`));
	});
});
gulp.task('sass:theme', THEMES.map((theme) => `sass:theme_${theme}`));

gulp.task('sass:doc', () => {
	return gulp.src('./src/css/doc/style.scss')
		.pipe($.sass())
		.pipe($.rename('style.css'))
		.pipe(gulp.dest('./doc'));
});

gulp.task('test', (callback) => {
	runSequence('js', 'qunit', callback);
});

gulp.task('watch', (callback) => {
	gulp.watch('./src/js/**/*.js', () => {
		gulp.start(['js'])
			.on('end', callback);
	});
	gulp.watch('./src/css/**/*.scss', () => {
		gulp.start(['sass'])
			.on('end', callback);
	});
});

gulp.task('sass', ['sass:theme', 'sass:doc']);
gulp.task('document', ['jsdoc']);
gulp.task('compile', ['sass:theme', 'js:dist']);
gulp.task('package', ['clean', 'compile', 'document', 'compress']);
gulp.task('default', ['watch']);
