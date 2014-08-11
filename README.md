# gulp-gjslint [![Build Status](https://travis-ci.org/TomSeldon/gulp-gjslint.svg?branch=master)](https://travis-ci.org/TomSeldon/gulp-gjslint)

> Lint Javascript using [Google's Javascript linter](https://developers.google.com/closure/utilities/)

## Install

```bash
$ npm install --save-dev gulp-gjslint
```

## Usage

```js
// See also: Gulpfile.js

var gulp = require('gulp'),
    gjslint = require('gulp-gjslint');

// Lint files and output results to the console
gulp.task('default', function() {
    return gulp.src('some/files/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'));
});

// Lint files, output to console and exit if
// an error is raised (useful for CI servers).
gulp.task('default', function() {
    return gulp.src('some/files/**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'), {fail: true})
});
```

## API

Options can be passed to the `gulp-gjslint` task, which will be passed directly
to the `gjslint` library.

See the [library documentation](https://github.com/jmendiara/node-closure-linter-wrapper)
for details on what can be specified.

*Note: The reporter option is disabled. Use the additional reporter tasks as shown in the
examples above.*

### gjslint(options)

Run gjslint on each file.

Writes `gjslint` object to each Vinyl object, e.g.

```js
{
    success: true,
    errors: [
        {
            line: 1,
            code: 2
            description: 'Missing space before "{"'
        }
    ]
}
```

### gjslint.reporter(name, options)

Write reporter on each file that was processed by `gjslint`.

#### Reporter: Console

Output results to the console.

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint'),
        options = {};

    return gulp.src('./**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console', options));
```

##### Default options:

```js
{
    fail: false // If true, emits an error on failure. Useful for CI servers.
                // Note: This will cause the task to fail after the first
                // linting error.
}
```

#### Reporter: Fail

Emits an error on when processing a failed file.

Intended for use with a CI server in conjunction with another style of reporter.

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint');

    return gulp.src('./**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'))
        .pipe(gjslint.reporter('fail'));
});
```

#### Reporter: Jshint Adapter

Experimental adapter for using Jshint reporters. Only tested with
[jshint-stylish](https://github.com/sindresorhus/jshint-stylish).

##### Example usage

```js
gulp.task('lint', function() {
    var gjslint = require('gulp-gjslint'),
        stylish = require('jshint-stylish').reporter,
        options = {};

    return gulp.src('./**/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('jshint', stylish, options));
});
```
