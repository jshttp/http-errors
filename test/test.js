var assert = require('assert')
var util = require('util')

var create = require('..')

describe('HTTP Errors', function () {
  it('create(status)', function () {
    var err = create(404)
    assert.equal(err.message, 'Not Found')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
  })

  it('create(status, msg)', function () {
    var err = create(404, 'LOL')
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
  })

  it('create(status, props)', function () {
    var err = create(404, {
      id: 1
    })
    assert.equal(err.message, 'Not Found')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
    assert.equal(1, err.id)
  })

  it('create(props)', function () {
    var err = create({
      id: 1
    })
    assert.equal(err.id, 1)
    assert.equal(err.message, 'Internal Server Error')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
  })

  it('create(msg, status)', function () {
    var err = create('LOL', 404)
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
  })

  it('create(msg)', function () {
    var err = create('LOL')
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
  })

  it('create(msg, props)', function () {
    var err = create('LOL', {
      id: 1
    })
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
    assert.equal(err.id, 1)
  })

  it ('create(err)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(_err)
    assert.equal(err, _err)
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.expose, true)

    _err = new Error('LOL')
    err = create(_err)
    assert.equal(err, _err)
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
    assert.equal(err.expose, false)
  })


  it('create(err) with invalid err.status', function () {
    var _err = new Error('Connection refused')
    _err.status = -1
    var err = create(_err)
    assert.equal(err, _err)
    assert.equal(err.message, 'Connection refused')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
    assert.equal(err.expose, false)
  })

  it('create(err, props)', function () {
    var _err = new Error('LOL')
    _err.status = 404
    var err = create(_err, {
      id: 1
    })
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.id, 1)
    assert.equal(err.expose, true)
  })

  it('create(status, err, props)', function () {
    var _err = new Error('LOL')
    var err = create(404, _err, {
      id: 1
    })
    assert.equal(err, _err)
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
  })

  it('create(status, msg, props)', function () {
    var err = create(404, 'LOL', {
      id: 1
    })
    assert.equal(err.message, 'LOL')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
  })

  it('create(status, msg, { expose: false })', function () {
    var err = create(404, 'LOL', {
      expose: false
    })
    assert.equal(err.expose, false)
  })

  it('new create.NotFound()', function () {
    var err = new create.NotFound()
    assert.equal(err.message, 'Not Found')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
    assert.equal(err.expose, true)
    assert(err.stack)
  })

  it('new create.InternalServerError()', function () {
    var err = new create.InternalServerError()
    assert.equal(err.message, 'Internal Server Error')
    assert.equal(err.status, 500)
    assert.equal(err.statusCode, 500)
    assert.equal(err.expose, false)
    assert(err.stack)
  })

  it('new create["404"]()', function () {
    var err = new create['404']()
    assert.equal(err.message, 'Not Found')
    assert.equal(err.status, 404)
    assert.equal(err.statusCode, 404)
    assert.equal(err.expose, true)
    assert(err.stack)
  })

  it('should preserve error [[Class]]', function () {
    var err = new create('LOL')
    assert.equal(Object.prototype.toString.call(err), '[object Error]')

    var err = new create[404]()
    assert.equal(Object.prototype.toString.call(err), '[object Error]')

    var err = new create[500]()
    assert.equal(Object.prototype.toString.call(err), '[object Error]')
  })

  it('should support err instanceof Error', function () {
    assert(create(404) instanceof Error)
    assert((new create['404']()) instanceof Error)
    assert((new create['500']()) instanceof Error)
  })

  it('should support util.isError()', function () {
    assert(util.isError(create(404)))
    assert(util.isError(new create['404']()))
    assert(util.isError(new create['500']()))
  })
})
