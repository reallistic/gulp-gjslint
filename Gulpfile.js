'use strict';

var gulp = require('gulp');
var srcFiles = 'lib/**/*.js';
var testFiles = 'tests/**/*.spec.js';

/**
 * Task: mocha
 *
 * Run unit tests using Mocha and generate
 * code coverage reports using Istanbul.
 */
gulp.task('mocha', function(done) {
  var istanbul = require('gulp-istanbul');
  var mocha = require('gulp-mocha');

  gulp.src(srcFiles)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(testFiles)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
});

/**
 * Task: jscs
 *
 * Lints library and spec files using JSCS.
 */
gulp.task('jscs', function() {
  var jscs = require('gulp-jscs');

  gulp.src([srcFiles, testFiles])
    .pipe(jscs());
});

/**
 * Task: fixjsstyle
 *
 * Fixes simple js issues using...itself. #lintception
 */
gulp.task('fixjsstyle', function() {
  var linter = require('./index'),
      fixjsstyle = linter.fixjsstyle;
  var options = {
    flags: [
      '--flagfile .fixjsstylerc'
    ]
  };

  return gulp.src([srcFiles, testFiles])
    .pipe(fixjsstyle(options))
    .pipe(linter.reporter('console'))
    .pipe(linter.reporter('fail'));
});

/**
 * Task: gjslint
 *
 * Lints library and spec files using...itself. #lintception
 */
gulp.task('gjslint', function() {
  var linter = require('./index'),
      gjslint = linter.gjslint;
  var options = {
    flags: [
      '--flagfile .gjslintrc'
    ]
  };

  return gulp.src([srcFiles, testFiles])
    .pipe(gjslint(options))
    .pipe(linter.reporter('console'))
    .pipe(linter.reporter('fail'));
});

/**
 * Task: lint
 *
 * Runs all linting tasks.
 */
gulp.task('lint', ['jscs', 'fixjsstyle', 'gjslint']);

/**
 * Task: watch
 */
gulp.task('watch', function() {
  gulp.watch([srcFiles, testFiles], ['mocha', 'lint']);
});
