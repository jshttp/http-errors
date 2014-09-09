
var statuses = require('statuses');
var inherits = require('util').inherits;

exports = module.exports = function () {
  // so much arity going on ~_~
  var err;
  var msg;
  var status = 500;
  var props = {};
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (arg instanceof Error) {
      err = arg;
      status = err.status || err.statusCode || status;
      continue;
    }
    switch (typeof arg) {
      case 'string':
        msg = arg;
        break;
      case 'number':
        status = arg;
        break;
      case 'object':
        props = arg;
        break;
    }
  }

  if (typeof status !== 'number' || !statuses[status]) status = 500;
  err = err || new Error(msg || statuses[status]);
  for (var key in props) err[key] = props[key];
  err.status = err.statusCode = status;
  err.expose = err.status < 500;
  return err;
};

// create generic error objects
var codes = statuses.codes.filter(function (num) {
  return num >= 400;
});

codes.forEach(function (code) {
  if (code >= 500) {
    var ServerError = function ServerError(msg) {
      Error.call(this);
      this.message = msg || statuses[code];
      Error.captureStackTrace(this, arguments.callee);
    }
    inherits(ServerError, Error);
    ServerError.prototype.status =
    ServerError.prototype.statusCode = code;
    ServerError.prototype.expose = false;
    exports[code] =
    exports[statuses[code].replace(/\s+/g, '')] = ServerError;
    return;
  }

  var ClientError = function ClientError(msg) {
    Error.call(this);
    this.message = msg || statuses[code];
    Error.captureStackTrace(this, arguments.callee);
  }
  inherits(ClientError, Error);
  ClientError.prototype.status =
  ClientError.prototype.statusCode = code;
  ClientError.prototype.expose = false;
  exports[code] =
  exports[statuses[code].replace(/\s+/g, '')] = ClientError;
  return;
});
