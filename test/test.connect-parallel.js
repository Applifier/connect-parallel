var parallel = require('../lib/connect-parallel');
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
    test.equals(req.foo[0], "bar");
    test.equals(req.foo[1], "foo");
    test.done();
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
    test.equals(err.message, "foobar");
    test.done();
  });
};