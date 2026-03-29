
process.env.NO_DEPRECATION = 'http-errors'

var assert = require('assert')
var util = require('util')

var createError = require('..')

var isError = typeof Error.isError === 'function'
  ? Error.isError
  // eslint-disable-next-line node/no-deprecated-api
  : typeof util.isError === 'function'
    // eslint-disable-next-line node/no-deprecated-api
    ? util.isError
    // Fallback for Node.js v23: util.isError was removed in Node.js v23 (EOL), and Error.isError was introduced in Node.js v24
    : function (err) {
      return err instanceof Error
    }

var itErrorIsError = typeof Error.isError === 'function'
  ? it
  : it.skip

// eslint-disable-next-line node/no-deprecated-api
var itUtilIsError = typeof util.isError === 'function'
  ? it
  : it.skip

describe('createError(status)', function () {
  it('should create error object', function () {
    assert.ok(isError(createError(500)))
  })

  describe('Extending Existing Errors with HTTP Properties', function () {
    it('should extend existing error without altering its prototype or replacing the object', function () {
      var nativeError = new Error('This is a test error')

      // Extend the error with HTTP semantics
      var httpError = createError(404, nativeError, { expose: false })

      assert.strictEqual(httpError.status, 404)
      assert.strictEqual(httpError.expose, false)

      assert.strictEqual(httpError.message, 'This is a test error')

      assert(httpError instanceof Error)

      assert.strictEqual(Object.getPrototypeOf(httpError), Error.prototype)

      assert.strictEqual(httpError, nativeError)
    })
  })

  describe('when status 300', function () {
    before(function () {
      this.error = createError(300)
    })

    it('should have "message" property of "Multiple Choices"', function () {
      assert.strictEqual(this.error.message, 'Multiple Choices')
    })

    it('should have "name" property of "Error"', function () {
      assert.strictEqual(this.error.name, 'Error')
    })

    it('should have "status" property of 300', function () {
      assert.strictEqual(this.error.status, 300)
    })

    it('should have "statusCode" property of 300', function () {
      assert.strictEqual(this.error.statusCode, 300)
    })
  })

  describe('when status 404', function () {
    before(function () {
      this.error = createError(404)
    })

    it('should have "message" property of "Not Found"', function () {
      assert.strictEqual(this.error.message, 'Not Found')
    })

    it('should have "name" property of "NotFoundError"', function () {
      assert.strictEqual(this.error.name, 'NotFoundError')
    })

    it('should have "status" property of 404', function () {
      assert.strictEqual(this.error.status, 404)
    })

    it('should have "statusCode" property of 404', function () {
      assert.strictEqual(this.error.statusCode, 404)
    })
  })

  describe('when status unknown 4xx', function () {
    before(function () {
      this.error = createError(499)
    })

    it('should have "message" property of "Bad Request"', function () {
      assert.strictEqual(this.error.message, 'Bad Request')
    })

    it('should have "name" property of "BadRequestError"', function () {
      assert.strictEqual(this.error.name, 'BadRequestError')
    })

    it('should have "status" property with code', function () {
      assert.strictEqual(this.error.status, 499)
    })

    it('should have "statusCode" property with code', function () {
      assert.strictEqual(this.error.statusCode, 499)
    })
  })

  describe('when status unknown 5xx', function () {
    before(function () {
      this.error = createError(599)
    })

    it('should have "message" property of "Internal Server Error"', function () {
      assert.strictEqual(this.error.message, 'Internal Server Error')
    })

    it('should have "name" property of "InternalServerError"', function () {
      assert.strictEqual(this.error.name, 'InternalServerError')
    })

    it('should have "status" property with code', function () {
      assert.strictEqual(this.error.status, 599)
    })

    it('should have "statusCode" property with code', function () {
      assert.strictEqual(this.error.statusCode, 599)
    })
  })
})

describe('createError(status, message)', function () {
  before(function () {
    this.error = createError(404, 'missing')
  })

  it('should create error object', function () {
    assert.ok(isError(this.error))
  })

  it('should have "message" property with message', function () {
    assert.strictEqual(this.error.message, 'missing')
  })

  it('should have "status" property with status', function () {
    assert.strictEqual(this.error.status, 404)
  })

  it('should have "statusCode" property with status', function () {
    assert.strictEqual(this.error.statusCode, 404)
  })
})

describe('createError.isHttpError(val)', function () {
  describe('when val is undefined', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(undefined), false)
    })
  })

  describe('when val is null', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(null), false)
    })
  })

  describe('when val is a number', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(42), false)
    })
  })

  describe('when val is a string', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError('foobar'), false)
    })
  })

  describe('when val is an empty object', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError({}), false)
    })
  })

  describe('when val is a plain Error', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(new Error()), false)
    })
  })

  describe('when val is an instance of HttpError', function () {
    it('should return true', function () {
      var err = createError(500)

      assert.ok(err instanceof createError.HttpError)
      assert.strictEqual(createError.isHttpError(err), true)
    })
  })

  describe('when val is an Error passed to createError', function () {
    it('should return true', function () {
      var err = createError(500, new Error())

      assert.ok(!(err instanceof createError.HttpError))
      assert.strictEqual(createError.isHttpError(err), true)
    })
  })
})

describe('HTTP Errors', function () {
  it('createError(status, props)', function () {
    var err = createError(404, {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, props) with status prop', function () {
    var err = createError(404, {
      id: 1,
      status: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, props) with statusCode prop', function () {
    var err = createError(404, {
      id: 1,
      statusCode: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(props)', function () {
    var err = createError({
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('createError(msg, status)', function () {
    assert.throws(function () {
      createError('LOL', 404)
    }, /argument #2 unsupported type number/)
  })

  it('createError(msg)', function () {
    var err = createError('LOL')
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
  })

  it('createError(msg, props)', function () {
    var err = createError('LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('createError(err)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)

    _err = new Error('LOL')
    err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)

    err = createError(null)
    assert.notStrictEqual(err, null)
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('createError(err) with invalid err.status', function () {
    var _err = new Error('Connection refused')
    _err.status = -1
    var err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'Connection refused')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('createError(err, props)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = createError(_err, {
      id: 1
    })
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
    assert.strictEqual(err.expose, true)
  })

  it('createError(status, err, props)', function () {
    var _err = new Error('LOL')
    var err = createError(404, _err, {
      id: 1
    })
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, msg, props)', function () {
    var err = createError(404, 'LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, msg, { expose: false })', function () {
    var err = createError(404, 'LOL', {
      expose: false
    })
    assert.strictEqual(err.expose, false)
  })

  it('new createError.HttpError()', function () {
    assert.throws(function () {
      new createError.HttpError() // eslint-disable-line no-new
    }, /cannot construct abstract class/)
  })

  it('new createError.NotFound()', function () {
    var err = new createError.NotFound()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('new createError.InternalServerError()', function () {
    var err = new createError.InternalServerError()
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
    assert(err.stack)
  })

  it('new createError["404"]()', function () {
    var err = new createError['404']()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('should preserve error [[Class]]', function () {
    assert.strictEqual(Object.prototype.toString.call(createError('LOL')), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new createError[404]()), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new createError[500]()), '[object Error]')
  })

  it('should support err instanceof Error', function () {
    assert(createError(404) instanceof Error)
    assert((new createError['404']()) instanceof Error)
    assert((new createError['500']()) instanceof Error)
  })

  it('should support err instanceof exposed constructor', function () {
    assert(createError(404) instanceof createError.NotFound)
    assert(createError(500) instanceof createError.InternalServerError)
    assert((new createError['404']()) instanceof createError.NotFound)
    assert((new createError['500']()) instanceof createError.InternalServerError)
    assert((new createError.NotFound()) instanceof createError.NotFound)
    assert((new createError.InternalServerError()) instanceof createError.InternalServerError)
  })

  it('should support err instanceof HttpError', function () {
    assert(createError(404) instanceof createError.HttpError)
    assert((new createError['404']()) instanceof createError.HttpError)
    assert((new createError['500']()) instanceof createError.HttpError)
  })

  itUtilIsError('should support util.isError()', function () {
    /* eslint-disable node/no-deprecated-api */
    assert(util.isError(createError(404)))
    assert(util.isError(new createError['404']()))
    assert(util.isError(new createError['500']()))
    /* eslint-enable node/no-deprecated-api */
  })

  itErrorIsError('should support Error.isError()', function () {
    assert(Error.isError(createError(404)))
    assert(Error.isError(new createError['404']()))
    assert(Error.isError(new createError['500']()))
  })
})

describe('createError() with no arguments', function () {
  before(function () {
    this.error = createError()
  })

  it('should default to status 500', function () {
    assert.strictEqual(this.error.status, 500)
    assert.strictEqual(this.error.statusCode, 500)
  })

  it('should have default message "Internal Server Error"', function () {
    assert.strictEqual(this.error.message, 'Internal Server Error')
  })

  it('should have expose set to false', function () {
    assert.strictEqual(this.error.expose, false)
  })
})

describe('createError(err) with err.statusCode', function () {
  it('should use err.statusCode when err.status is not set', function () {
    var _err = new Error('Something failed')
    _err.statusCode = 503
    var err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.status, 503)
    assert.strictEqual(err.statusCode, 503)
    assert.strictEqual(err.expose, false)
  })

  it('should prefer err.status over err.statusCode', function () {
    var _err = new Error('Conflict')
    _err.status = 409
    _err.statusCode = 500
    var err = createError(_err)
    assert.strictEqual(err.status, 409)
    assert.strictEqual(err.statusCode, 409)
    assert.strictEqual(err.expose, true)
  })
})

describe('expose property', function () {
  it('should be true for 4xx errors created via factory', function () {
    assert.strictEqual(createError(400).expose, true)
    assert.strictEqual(createError(404).expose, true)
    assert.strictEqual(createError(499).expose, true)
  })

  it('should be false for 5xx errors created via factory', function () {
    assert.strictEqual(createError(500).expose, false)
    assert.strictEqual(createError(503).expose, false)
    assert.strictEqual(createError(599).expose, false)
  })

  it('should be true for 4xx named constructors', function () {
    assert.strictEqual(new createError.BadRequest().expose, true)
    assert.strictEqual(new createError.Unauthorized().expose, true)
    assert.strictEqual(new createError.Forbidden().expose, true)
    assert.strictEqual(new createError.NotFound().expose, true)
  })

  it('should be false for 5xx named constructors', function () {
    assert.strictEqual(new createError.InternalServerError().expose, false)
    assert.strictEqual(new createError.BadGateway().expose, false)
    assert.strictEqual(new createError.ServiceUnavailable().expose, false)
    assert.strictEqual(new createError.GatewayTimeout().expose, false)
  })
})

describe('custom headers via properties', function () {
  it('should attach headers from properties object', function () {
    var err = createError(401, 'Authentication required', {
      headers: {
        'www-authenticate': 'Bearer realm="example"'
      }
    })
    assert.strictEqual(err.status, 401)
    assert.deepStrictEqual(err.headers, {
      'www-authenticate': 'Bearer realm="example"'
    })
  })

  it('should not have headers by default', function () {
    var err = createError(404)
    assert.strictEqual(err.headers, undefined)
  })
})

describe('createError argument type validation', function () {
  it('should throw TypeError for boolean argument', function () {
    assert.throws(function () {
      createError(true)
    }, /unsupported type boolean/)
  })

  it('should throw TypeError for function argument', function () {
    assert.throws(function () {
      createError(404, function () {})
    }, /unsupported type function/)
  })
})

describe('named constructor with custom message', function () {
  it('should use custom message for client error', function () {
    var err = new createError.BadRequest('Invalid email format')
    assert.strictEqual(err.message, 'Invalid email format')
    assert.strictEqual(err.status, 400)
    assert.strictEqual(err.statusCode, 400)
  })

  it('should use custom message for server error', function () {
    var err = new createError.ServiceUnavailable('Database connection lost')
    assert.strictEqual(err.message, 'Database connection lost')
    assert.strictEqual(err.status, 503)
    assert.strictEqual(err.statusCode, 503)
  })

  it('should use default message when null is passed', function () {
    var err = new createError.NotFound(null)
    assert.strictEqual(err.message, 'Not Found')
  })
})
