/*
 * gulp-gjslint
 */

'use strict';

var GulpGjslint = require(__dirname + '/lib/GulpGjslint');
var GulpFixJsStyle = require(__dirname + '/lib/GulpFixJsstyle');
var lint;
var fix;

/**
 * @param {Object=} options
 * @returns {null|*}
 */
lint = function(options)
{
  var gulpGjslint = new GulpGjslint(options);

  return gulpGjslint.run();
};

/**
 * @param {Object=} options
 * @returns {null|*}
 */
fix = function(options)
{
  var gulpFixjsStyle = new GulpFixJsStyle(options);

  return gulpFixjsStyle.run();
};

/**
 * @type {Function}
 */
module.exports.gjslint = lint;

/**
 * @type {Function}
 */
module.exports.fixjsstyle = fix;

/**
 * @type {*}
 */
module.exports.reporter = GulpGjslint.reporter;
