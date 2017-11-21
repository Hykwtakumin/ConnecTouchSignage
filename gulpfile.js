'use strict'
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');

var config = {
    entryFile: './app.js',
    outputDir: './',
    outputFile: 'bundle.js',
    sassPath: './*.scss',
    es6Path: './*.js',
};

gulp.task('sass', function() {
    gulp.src(config.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.outputDir));
})

gulp.task('browserify', function() {
    browserify(config.entryFile, { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source(config.outputFile))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('watch', function() {
    gulp.watch(config.es6Path, ['browserify']);
    gulp.watch(config.sassPath, ['sass']);
});