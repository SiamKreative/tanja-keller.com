var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var surge = require('gulp-surge');
var browserSync = require('browser-sync').create();

/**
 * Copy images & fonts
 */
gulp.task('copyimages', function () {
	gulp.src('./src/images/**')
		.pipe(gulp.dest('dist/images'));
});
gulp.task('copyfavicons', function () {
	gulp.src('./src/*.{png,ico}')
		.pipe(gulp.dest('dist'));
});
gulp.task('copyfonts', function () {
	gulp.src('./src/icon-fonts/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('dist/icon-fonts'));
});
gulp.task('copypdf', function () {
	gulp.src('./src/pdf/**')
		.pipe(gulp.dest('dist/pdf'));
});
gulp.task('copy', ['copyimages', 'copyfavicons', 'copyfonts', 'copypdf']);

/**
 * Concatenate & minify static assets
 */
gulp.task('assets', function () {
	return gulp.src('./src/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cleanCSS()))
		.pipe(gulpif('*.html', htmlmin({
			collapseWhitespace: true
		})))
		.pipe(gulp.dest('dist'));
});

/**
 * Deploy to surge
 */
gulp.task('surge', ['default'], function () {
	return surge({
		project: './dist',
		domain: 'tanja-keller.com'
	})
});

/**
 * Static Server + watching scss/html files
 */
gulp.task('serve', function () {
	browserSync.init({
		server: './src'
	});
	// watch html and reload browsers when it changes
	gulp.watch('src/*.html').on('change', browserSync.reload);
	// watch css and stream to BrowserSync when it changes
	gulp.watch('src/**/*.css', function () {
		// grab css files and send them into browserSync.stream
		gulp.src('src/**/*.css')
			.pipe(browserSync.stream());
	});
});

gulp.task('default', ['copy', 'assets']);
gulp.task('deploy', ['default', 'surge']);