'use strict';

var chai = require('chai');
var sinonChai = require('sinon-chai');
var File = require('gulp-util').File;
var PluginError = require('gulp-util').PluginError;
var GulpGjslint = require('../lib/GulpGjslint');
var GulpFixJsStyle = require('../lib/GulpFixjsstyle');

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('GJslint Error creation', function() {
  var gulpGjslint;

  beforeEach(function() {
    gulpGjslint = new GulpGjslint();
  });

  afterEach(function() {
    gulpGjslint = null;
  });

  it('should have a method for logging an error', function() {
    gulpGjslint.should.have.property('createError');
  });

  it('should return a PluginError instance when called', function() {
    var err = gulpGjslint.createError('some message');

    err.should.be.an.instanceof(PluginError);
  });

  it('should create a PluginError instance with the ' +
    'correct message and plugin name',
    function() {
      var err = gulpGjslint.createError('some message');

      err.plugin.should.equal('gulp-gjslint');
      err.message.should.equal('some message');
    }
  );
});


describe('FixJSStyle Error creation', function() {
  var gulpFixJsstyle;

  beforeEach(function() {
    gulpFixJsstyle = new GulpFixJsStyle();
  });

  afterEach(function() {
    gulpFixJsstyle = null;
  });

  it('should have a method for logging an error', function() {
    gulpFixJsstyle.should.have.property('createError');
  });

  it('should return a PluginError instance when called', function() {
    var err = gulpFixJsstyle.createError('some message');

    err.should.be.an.instanceof(PluginError);
  });

  it('should create a PluginError instance with the ' +
    'correct message and plugin name',
    function() {
      var err = gulpFixJsstyle.createError('some message');

      err.plugin.should.equal('gulp-fixjsstyle');
      err.message.should.equal('some message');
    }
  );
});
