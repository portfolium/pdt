var gulp = require('gulp');
var header = require('gulp-header');
var babel = require('gulp-babel'); // for the gulp build

gulp.task('build', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(header('#!/usr/bin/env node\n'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('dev', function() {
    return gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['dev']);
