var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var surge = require('gulp-surge');

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
gulp.task('copy', ['copyimages', 'copyfavicons', 'copyfonts']);

/**
 * Concatenate & minify static assets
 */
gulp.task('assets', function () {
	return gulp.src('./src/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cssmin()))
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
		domain: 'staging.tanja-keller.com'
	})
})

gulp.task('default', ['copy', 'assets']);
gulp.task('deploy', ['default', 'surge']);