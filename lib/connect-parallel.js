/*!
 * connect-parallel
 * Copyright(c) 2011 Jaakko Lukkari <opensource@applifier.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.0.3';

/**
 * Middleware that enables asynchronous middlewares to run parallel.
 *
 * @param {Array} array of asynchronous middlewares to be run in parallel
 * @return {Function}
 * @api public
 */

exports = module.exports = function(middlewares) {
  if(!Array.isArray(middlewares)) {
    middlewares = Array.prototype.slice.call(arguments);
  }
  return function(req, res, next){
    var results = 0;
    var errorReceived = false;
    middlewares.forEach(function(middleware){
      middleware(req, res, function(err){
        if(err) {
          if(!errorReceived) {
            errorReceived = true;
            next(err);
          }
          return;
        }

        results++;
        if(results == middlewares.length && !errorReceived) {
          next();
        }
      });
    });
  };
};
