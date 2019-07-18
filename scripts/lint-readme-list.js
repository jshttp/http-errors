var assert = require('assert')
var createError = require('..')
var fs = require('fs')
var path = require('path')
var util = require('util')

var README_PATH = path.join(__dirname, '..', 'README.md')
var README_CONTENTS = fs.readFileSync(README_PATH, 'utf-8')

Object.keys(createError).forEach(function (key) {
  if (!isNaN(key)) {
    return
  }

  var constructor = createError[key]
  var statusCode = constructor.prototype.statusCode

  if (createError[statusCode] !== constructor) {
    return
  }

  var regexp = new RegExp(util.format('^\\|%d\\s*\\|%s\\s*\\|$', statusCode, key), 'm')

  assert.ok(regexp.test(README_CONTENTS),
    util.format('README constructor list contains %d %s', statusCode, key))
})
