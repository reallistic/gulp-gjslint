/*
 * gulp-gjslint
 */

'use strict';

var GulpFixjsStyle;
var fixjsstyle = require('closure-linter-wrapper').fixjsstyle;
var PluginError = require('gulp-util').PluginError;
var merge = require('merge');
var through = require('through2');
var errorFactory = require('./util/error-factory');

/**
 * @param {Object=} options
 * @constructor
 */
GulpFixjsStyle = function(options)
{
  // Set options to empty object if none were specified
  options = options || {};

  /**
   * Merge options with the default options.
   *
   * @type {*|exports}
   */
  this.options = merge({}, GulpFixjsStyle.DEFAULT_OPTIONS, options);

  // Force reporter to be null as reporting is handled separately
  this.options.reporter = GulpFixjsStyle.DEFAULT_OPTIONS.reporter;

  /**
   * Initialise stream property.
   *
   * @type {null}
   */
  this.stream = null;

  /**
   * @type {Function}
   */
  this.createError = new errorFactory(GulpFixjsStyle.PLUGIN_NAME);
};

/**
 * @type {string}
 */
GulpFixjsStyle.PLUGIN_NAME = 'gulp-fixjsstyle';

/**
 * @type {Object}
 */
GulpFixjsStyle.DEFAULT_OPTIONS = {
  reporter: null
};

/**
 * @type {*}
 */
GulpFixjsStyle.reporter = require(__dirname + '/reporters');

/**
 * Adds linting result data to a File object.
 *
 * This data can be used by a reporter after the stream
 * has finished.
 *
 * @param {File} file
 * @param {string=} result
 * @return {File}
 */
GulpFixjsStyle.prototype.parseResults = function(file, result)
{
  file.fixjsstyle = {
    success: true
  };

  if (result) {
    file.fixjsstyle.results = result;
  }

  return file;
};

/**
 * @param {File} file
 * @param {String} encoding
 * @param {Function} callback
 * @return {Function=}
 */
GulpFixjsStyle.prototype.processFile = function(file, encoding, callback)
{
  // Get copy of options, so that any modifications
  // will be for this file only.
  var options = merge({}, this.options);

  if (file.isStream()) {
    this.stream.emit(
      'error',
      this.createError('Streaming is not supported')
    );

    return callback();
  }

  options.src = [file.path];

  fixjsstyle(options, function(err, result) {
    // Check fixjsstyle didn't blow up
    if (err && (err.code == 4)) {
      /*
       Exit codes:
       4: fixjsstyle exception
       */

      var errorMessage;

      errorMessage = 'fixjsstyle crashed whilst parsing: ' + file.path +
       '\nReason: ' + err.description +
        '\n\n' + err.info;

      this.stream.emit('error', this.createError(errorMessage));
    }

    // Store result data on the file object
    file = this.parseResults(file, result);

    this.stream.push(file);

    callback();
  }.bind(this));

  return null;
};

/**
 * @return {Stream=}
 */
GulpFixjsStyle.prototype.run = function()
{
  this.stream = through.obj(this.processFile.bind(this));

  return this.stream;
};

/**
 * @type {GulpFixjsStyle}
 */
module.exports = GulpFixjsStyle;
