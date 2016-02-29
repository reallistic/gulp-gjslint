/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint;
var gjslint = require('closure-linter-wrapper').gjslint;
var PluginError = require('gulp-util').PluginError;
var merge = require('merge');
var through = require('through2');
var errorFactory = require('./util/error-factory');

/**
 * @param {Object=} options
 * @constructor
 */
GulpGjslint = function(options)
{
  // Set options to empty object if none were specified
  options = options || {};

  /**
   * Merge options with the default options.
   *
   * @type {*|exports}
   */
  this.options = merge({}, GulpGjslint.DEFAULT_OPTIONS, options);

  // Force reporter to be null as reporting is handled separately
  this.options.reporter = GulpGjslint.DEFAULT_OPTIONS.reporter;

  /**
   * Initialise stream property.
   *
   * @type {null}
   */
  this.stream = null;

  /**
   * @type {Function}
   */
  this.createError = new errorFactory(GulpGjslint.PLUGIN_NAME);

  /**
   * @type {Object.<string, File>}
   */
  this.files = {};
};

/**
 * @type {string}
 */
GulpGjslint.PLUGIN_NAME = 'gulp-gjslint';

/**
 * @type {Object}
 */
GulpGjslint.DEFAULT_OPTIONS = {
  reporter: null,
  src: []
};

/**
 * @type {*}
 */
GulpGjslint.reporter = require(__dirname + '/reporters');

/**
 * Adds linting result data to a File object.
 *
 * This data can be used by a reporter after the stream
 * has finished.
 *
 * @param {File} file
 * @param {Object=} errors
 * @return {File}
 */
GulpGjslint.prototype.parseResults = function(file, errors)
{
  if (errors) {
    errors.info.fails.some(function(fail) {
      var path = fail.file;
      fail.total = fail.errors.length;
      if (path == file.path) {
          file.gjslint = {
            results: fail,
            success: false
          };
          return true;
      }
      return false;
    }, this);
  }

  if (!file.gjslint) {
    file.gjslint = {
      success: true
    };
  }

  return file;
};

/**
 * @param {File} file
 * @param {String} encoding
 * @param {Function} callback
 * @return {Function=}
 */
GulpGjslint.prototype.compileFiles = function(file, encoding, callback) {
  if (file.isStream()) {
    this.stream.emit(
      'error',
      this.createError('Streaming is not supported')
    );

    return callback();
  }

  this.options.src.push(file.path);
  this.files[file.path] = file;

  callback();
  return null;
};


/**
 * @param {Function} callback
 * @return {Function=}
 */
GulpGjslint.prototype.processFiles = function(callback)
{
  gjslint(this.options, function(err) {
    // Store result data on the file object
    var files = Object.keys(this.files).map(function(key) {
        return this.parseResults(this.files[key], err);
    }, this);

    files.forEach(function(file) {
        this.stream.push(file);
    }, this);

    // Check gjslint didn't blow up
    if (err && (err.code !== 0 && err.code !== 2)) {
      /*
       Exit codes:
       0: Linting success
       1: Python not found
       2: Linting failed
       3: Parsing failed
       4: gjslint exception
       */

      var errorMessage;

      errorMessage = 'gjslint crashed whilst parsing: ' + file.path +
       '\nReason: ' + err.description +
        '\n\n' + err.info;

      this.stream.emit('error', this.createError(errorMessage));
    }

    callback();
  }.bind(this));

  return null;
};

/**
 * @return {Stream=}
 */
GulpGjslint.prototype.run = function()
{
  this.stream = through.obj(this.compileFiles.bind(this),
                            this.processFiles.bind(this));

  return this.stream;
};

/**
 * @type {GulpGjslint}
 */
module.exports = GulpGjslint;
