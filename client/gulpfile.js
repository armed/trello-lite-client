var g = require('gulp');
var through = require('through2');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var flatten = require('gulp-flatten');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-rimraf');
var path = require('path');

var conf = require('./build.conf');

g.task('vendor-fonts', function () {
  g.src(conf.vendor.fonts)
    .pipe(flatten(conf.flatten.fonts))
    .pipe(g.dest(conf.dist));
});

g.task('vendor-less', function () {
  g.src(conf.vendor.less)
    .pipe(less())
    .pipe(cssmin(conf.cssmin))
    .pipe(flatten(conf.flatten.css))
    .pipe(g.dest(conf.dist));
});

g.task('vendor-js', function () {
  g.src(conf.vendor.js)
    .pipe(concat('vendor.min.js'))
    .pipe(flatten(conf.flatten.js))
    .pipe(g.dest(conf.dist));
});

g.task('vendor', ['vendor-fonts', 'vendor-less', 'vendor-js']);

g.task('less', function () {
  g.src(conf.app.less)
    .pipe(less())
    .pipe(cssmin(conf.cssmin))
    .pipe(flatten(conf.flatten.css))
    .pipe(g.dest(conf.dist));
});

g.task('js', function () {
  g.src(conf.app.js)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(flatten(conf.flatten.js))
    .pipe(g.dest(conf.dist));
});

g.task('jade', function () {
  g.src(conf.app.html)
    .pipe(jade({data: {dev: true, version: Number(new Date())}}))
    .pipe(flatten())
    .pipe(g.dest(conf.dist));
  g.src(conf.app.partials)
    .pipe(jade())
    .pipe(flatten(conf.flatten.partials))
    .pipe(g.dest(conf.dist));
});

g.task('clean', function () {
  g.src(conf.dist, {read: false})
    .pipe(clean());
});

g.task('app', ['less', 'js', 'jade']);

g.task('default', function () {
  g.run('vendor', 'app');
});
