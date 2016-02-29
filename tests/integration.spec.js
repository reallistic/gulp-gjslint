'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var File = require('gulp-util').File;
var gulp = require('gulp');
var gulpGjslint = require('../index').gjslint;
var gulpFixJsStyle = require('../index').fixjsstyle;

// Setup test tools
chai.should();
chai.use(sinonChai);

describe('Integration tests with gjslint', function() {
  var errSpy;

  // Increase Mocha's timeout, as we're testing
  // against a real instance of the linter so it
  // may be slow.
  this.timeout(8000);

  beforeEach(function() {
    errSpy = sinon.spy();
  });

  afterEach(function() {
    errSpy = null;
  });

  it('should not emit an error when linting files, ' +
    'whether they fail or not',
    function(done) {
      gulp.src('tests/fixtures/**.js')
        .pipe(gulpGjslint())
        .on('error', errSpy)
        .on('data', function() {
          errSpy.callCount.should.equal(0);
        })
        .on('end', done);
    }
  );
});


describe('Integration tests with fixjsstyle', function() {
  var errSpy;

  // Increase Mocha's timeout, as we're testing
  // against a real instance of the linter so it
  // may be slow.
  this.timeout(8000);

  beforeEach(function() {
    errSpy = sinon.spy();
  });

  afterEach(function() {
    errSpy = null;
  });

  it('should not emit an error when fixing files, ' +
    'whether they fail or not',
    function(done) {
      gulp.src('tests/fixtures/**.js')
        .pipe(gulpFixJsStyle())
        .on('error', errSpy)
        .on('data', function() {
          errSpy.callCount.should.equal(0);
        })
        .on('end', done);
    }
  );
});
