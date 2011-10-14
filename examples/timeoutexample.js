/**
 * This example demonstrates the difference between running asynchronous middlewares in waterfall and parallel.
 *
 * Example requires connect, so $ npm install connect
 *
 */


var parallel = require('../lib/connect-parallel');
var connect = require('connect');
var http = require('http');

// Middlewares

function middlewareA(req, res, next) {
  setTimeout(function() {
    next();
  }, 4000);
}

function middlewareB(req, res, next) {
  setTimeout(function() {
    next();
  }, 3000);
}


var waterfallServer = connect.createServer(
  middlewareA,
  middlewareB
);
waterfallServer.listen(3001);

var parallelServer = connect.createServer(
  parallel([middlewareA,
    middlewareB])
);
parallelServer.listen(3002);


function calculateRequestTime(port, callback) {
  var options = {
    host: 'localhost',
    port: port,
    path: '/'
  };
  var start = (new Date()).getTime();
  http.get(options,
    function(res) {
      callback((new Date()).getTime() - start);
    });
}

calculateRequestTime(3001, function(time) {
  console.log("Waterfall server completed the request in "+(time/1000)+"s");
  waterfallServer.close();
});

calculateRequestTime(3002, function(time) {
  console.log("Parallel server completed the request in "+(time/1000)+"s");
  parallelServer.close();
});