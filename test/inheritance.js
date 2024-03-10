const createError = require('../index')
var assert = require('assert')

function getProtoChain (object) {
  const chain = []
  let proto = Object.getPrototypeOf(object)
  while (proto) {
    chain.push(proto.constructor.name)
    proto = Object.getPrototypeOf(proto)
  }
  return chain
}

function getProtoString (object) {
  return getProtoChain(object).join('.')
}

describe('Inheritance', () => {
  it('Subclasses are instances of themselves', () => {
    class CustomError extends createError.NotFound {}
    const err = new CustomError()

    assert.ok(err instanceof CustomError, `Subclass not instanceof itself: looking for CustomError ${getProtoString(err)}`)
  })
  it('Subclasses are instances of their ancestors', () => {
    class CustomError extends createError.NotFound {}
    class MoreCustom extends CustomError {}
    const err = new MoreCustom()

    assert.ok(err instanceof Error, `Subclass not instanceof its ancestor: looking for Error ${getProtoString(err)}`)
    assert.ok(err instanceof createError.HttpError, `Subclass not instanceof its grandparent: looking for HttpError ${getProtoString(err)}`)
    assert.ok(err instanceof createError.NotFound, `Subclass not instanceof its grandparent: looking for NotFound ${getProtoString(err)}`)
    assert.ok(err instanceof CustomError, `Subclass not instanceof its parent: looking for CustomError ${getProtoString(err)}`)
  })
})

describe('Inheritance without new keyword', () => {
  it('createError returns errors that are instances of the associated status\' constructor', () => {
    const err = createError(404, 'Custom message', { customProperty: 'custom value' })

    assert.ok(err.customProperty === 'custom value', `Custom property not set: looking "for custom value", found ${err.customProperty}`)
    assert.ok(err instanceof createError.NotFound, `Instance not instanceof itself: looking for NotFound ${getProtoString(err)}`)

    const serverError = createError({ customProperty: 'custom value' })

    assert.ok(serverError.customProperty === 'custom value', `Custom property not set: looking "for custom value", found ${err.customProperty}`)
    assert.ok(serverError instanceof createError.InternalServerError, `Instance not instanceof itself: looking for InternalServerError ${getProtoString(err)}`)
  })

  it('Dynamic constructor factory functions return instances of themselves', () => {
    const err = createError.NotFound('Not Found')

    assert.ok(err instanceof createError.NotFound, `Instance not instanceof itself: looking for NotFound ${getProtoString(err)}`)
  })

  it('Dynamic constructor factory functions return instances of their ancestors', () => {
    const err = createError.NotFound('Not Found')

    assert.ok(err instanceof Error, `Subclass not instanceof its ancestor: looking for Error ${getProtoString(err)}`)
    assert.ok(err instanceof createError.HttpError, `Subclass not instanceof its grandparent: looking for HttpError ${getProtoString(err)}`)
  })
})

