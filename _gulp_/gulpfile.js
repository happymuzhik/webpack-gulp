const gulp = require('gulp');
const stylus = require('gulp-stylus');
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer-stylus');
const concat = require('gulp-concat');

const dev_css_dir = './dev/css/';
const dev_js_dir = './dev/js/';

const css_dir = './public/css/';
const js_dir = './public/js/';

gulp.task('stylus', function () {
	return gulp.src(dev_css_dir+'style.styl')
	.pipe(plumber())
	.pipe(stylus({
		compress: false,
		use: [autoprefixer()]
	}))
	.pipe(gulp.dest(css_dir));
});

gulp.task('jsconcat', function() {
  return gulp.src([dev_js_dir+'first.js', dev_js_dir+'second.js'])
  	.pipe(plumber())
    .pipe(concat('common.js'))
    .pipe(gulp.dest(js_dir));
});

gulp.task('watch', ['stylus', 'jsconcat'],function() {
	gulp.watch('./project/css/*.styl',['stylus']);
	gulp.watch('./project/js/*.js',['jsconcat']);
});