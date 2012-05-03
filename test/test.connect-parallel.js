var parallel = process.env.EXPRESS_COV ? require('../lib-cov/connect-parallel') : require('../lib/connect-parallel');
var assert = require('assert');

exports.testParallel = function(test) {
  var req = {foo:[]};
  var res = {};
  parallel([
  function(req, res, next){
    setTimeout(function(){
      req.foo.push("foo");
      next();
    }, 30);
  },
  function(req, res, next){
    req.foo.push("bar");
    next();
  }
  ])(req, res, function(){
    assert.equal(req.foo[0], "bar");
    assert.equal(req.foo[1], "foo");
    test();
  });
};


exports.testParallelWithError = function(test) {
  var req = {foo:[]};
  var res = {};
  parallel([
  function(req, res, next){
    setTimeout(function(){
      req.foo.push("foo");
      next();
    }, 30);
  },
  function(req, res, next){
    next(new Error("foobar"));
  }
  ])(req, res, function(err){
    assert.equal(err.message, "foobar");
    test();
  });
};

exports.testWithArguments = function(test) {
  var req = {foo:[]};
  var res = {};
  parallel(
  function(req, res, next){
    setTimeout(function(){
      req.foo.push("foo");
      next();
    }, 30);
  },
  function(req, res, next){
    next(new Error("foobar"));
  })(req, res, function(err){
    assert.equal(err.message, "foobar");
    test();
  });
};
