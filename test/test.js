
process.env.NO_DEPRECATION = 'http-errors'

var assert = require('assert')
var util = require('util')

var create = require('..')

describe('HTTP Errors', function () {
  it('create(status)', function () {
    var err = create(404)
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
  })

  it('create(status) for 300', function () {
    var err = create(300)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'Multiple Choices')
    assert.strictEqual(err.status, 300)
    assert.strictEqual(err.statusCode, 300)
  })

  it('create(status) for 471', function () {
    var err = create(471)
    assert.strictEqual(err.name, 'BadRequestError')
    assert.strictEqual(err.message, 'Bad Request')
    assert.strictEqual(err.status, 471)
    assert.strictEqual(err.statusCode, 471)
  })

  it('create(status) for 520', function () {
    var err = create(520)
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 520)
    assert.strictEqual(err.statusCode, 520)
  })

  it('create(status, msg)', function () {
    var err = create(404, 'LOL')
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
  })

  it('create(status, props)', function () {
    var err = create(404, {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('create(status, props) with status prop', function () {
    var err = create(404, {
      id: 1,
      status: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('create(status, props) with statusCode prop', function () {
    var err = create(404, {
      id: 1,
      statusCode: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('create(props)', function () {
    var err = create({
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('create(props) with status prop', function () {
    var err = create({
      id: 1,
      status: 418
    })
    assert.equal(err.name, 'ImATeapotError')
    assert.equal(err.message, "I'm a teapot")
    assert.equal(err.status, 418)
    assert.equal(err.statusCode, 418)
    assert.equal(err.id, 1)
  })

  it('create(props) with statusCode prop', function () {
    var err = create({
      id: 1,
      statusCode: 418
    })
    assert.equal(err.name, 'ImATeapotError')
    assert.equal(err.message, "I'm a teapot")
    assert.equal(err.status, 418)
    assert.equal(err.statusCode, 418)
    assert.equal(err.id, 1)
  })

  it('create(msg, status)', function () {
    var err = create('LOL', 404)
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
  })

  it('create(msg)', function () {
    var err = create('LOL')
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
  })

  it('create(msg, props)', function () {
    var err = create('LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('create(err)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)

    _err = new Error('LOL')
    err = create(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)

    err = create(null)
    assert.notStrictEqual(err, null)
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('create(err) with invalid err.status', function () {
    var _err = new Error('Connection refused')
    _err.status = -1
    var err = create(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'Connection refused')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('create(status, err)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(418, _err)
    assert.equal(err, _err)
    assert.equal(err.name, 'Error')
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
    assert.equal(err.expose, true)
  })

  it('create(err, props)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(_err, {
      id: 1
    })
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
    assert.strictEqual(err.expose, true)
  })

  it('create(err, props) with status prop', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(_err, {
      id: 1,
      status: 418
    })
    assert.equal(err.name, 'Error')
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
    assert.equal(err.id, 1)
    assert.equal(err.expose, true)
  })

  it('create(status, err, props)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(418, _err, {
      id: 1,
      status: 410
    })
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('create(status, msg, props)', function () {
    var err = create(404, 'LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('create(status, msg, { expose: false })', function () {
    var err = create(404, 'LOL', {
      expose: false
    })
    assert.strictEqual(err.expose, false)
  })

  it('new create.HttpError()', function () {
    assert.throws(function () {
      new create.HttpError() // eslint-disable-line no-new
    }, /cannot construct abstract class/)
  })

  it('new create.NotFound()', function () {
    var err = new create.NotFound()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('new create.InternalServerError()', function () {
    var err = new create.InternalServerError()
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
    assert(err.stack)
  })

  it('new create["404"]()', function () {
    var err = new create['404']()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('should preserve error [[Class]]', function () {
    assert.strictEqual(Object.prototype.toString.call(create('LOL')), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new create[404]()), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new create[500]()), '[object Error]')
  })

  it('should support err instanceof Error', function () {
    assert(create(404) instanceof Error)
    assert((new create['404']()) instanceof Error)
    assert((new create['500']()) instanceof Error)
  })

  it('should support err instanceof exposed constructor', function () {
    assert(create(404) instanceof create.NotFound)
    assert(create(500) instanceof create.InternalServerError)
    assert((new create['404']()) instanceof create.NotFound)
    assert((new create['500']()) instanceof create.InternalServerError)
    assert((new create.NotFound()) instanceof create.NotFound)
    assert((new create.InternalServerError()) instanceof create.InternalServerError)
  })

  it('should support err instanceof HttpError', function () {
    assert(create(404) instanceof create.HttpError)
    assert((new create['404']()) instanceof create.HttpError)
    assert((new create['500']()) instanceof create.HttpError)
  })

  it('should support util.isError()', function () {
    /* eslint-disable node/no-deprecated-api */
    assert(util.isError(create(404)))
    assert(util.isError(new create['404']()))
    assert(util.isError(new create['500']()))
    /* eslint-enable node/no-deprecated-api */
  })
})
