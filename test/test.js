
var assert = require('assert');

var create = require('..');

describe('HTTP Errors', function () {
  it('create(status)', function () {
    var err = create(404);
    assert.equal(err.message, 'Not Found');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
  })

  it('create(status, msg)', function () {
    var err = create(404, 'LOL');
    assert.equal(err.message, 'LOL');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
  })

  it('create(props)', function () {
    var err = create({
      id: 1
    });
    assert.equal(err.id, 1);
    assert.equal(err.message, 'Internal Server Error');
    assert.equal(err.status, 500);
    assert.equal(err.statusCode, 500);
  })

  it('create(msg, status)', function () {
    var err = create('LOL', 404);
    assert.equal(err.message, 'LOL');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
  })

  it('create(msg)', function () {
    var err = create('LOL');
    assert.equal(err.message, 'LOL');
    assert.equal(err.status, 500);
    assert.equal(err.statusCode, 500);
  })

  it('create(status, err, props)', function () {
    var _err = new Error('LOL');
    var err = create(404, _err, {
      id: 1
    });
    assert.equal(err, _err);
    assert.equal(err.message, 'LOL');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
  })

  it('new create.NotFound()', function () {
    var err = new create.NotFound();
    assert.equal(err.message, 'Not Found');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
    assert(err.stack);
  })

  it('new create.InternalServerError()', function () {
    var err = new create.InternalServerError();
    assert.equal(err.message, 'Internal Server Error');
    assert.equal(err.status, 500);
    assert.equal(err.statusCode, 500);
    assert(err.stack);
  })

  it('new create["404"]()', function () {
    var err = new create['404']();
    assert.equal(err.message, 'Not Found');
    assert.equal(err.status, 404);
    assert.equal(err.statusCode, 404);
    assert(err.stack);
  })
})
