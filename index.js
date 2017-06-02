'use strict'

const fs   = require('fs')
const path = require('path')

function Pathname(filepath) {
  this._filepath = filepath
}

Pathname.prototype = {
  ascend: function() {
    let result = []
    let currentPath = this
    let sepCount = (this.toString().match(new RegExp(path.sep, 'g')) || []).length + 1
    for (; sepCount > 0; sepCount--) {
      result.push(currentPath)
      if (currentPath.isRoot()) { break }
      currentPath = currentPath.parent()
    }
    return result
  },

  basename: function(ext) {
    return new Pathname(path.basename(this.toString(), ext))
  },

  cleanpath: function() {
    return new Pathname(path.normalize(this.toString()))
  },

  descend: function() {
    return this.ascend().reverse()
  },

  dirname: function() {
    return new Pathname(path.dirname(this.toString()))
  },

  eachFilename: function(callback) {
    this.toString().split(path.sep).forEach(filepath => {
      if (filepath) { callback(filepath) }
    })
  },

  expandPath: function(defaultDir) {
    return new Pathname(path.resolve(defaultDir || '.', this.toString()))
  },

  extname: function() {
    return path.extname(this.toString())
  },

  isAbsolute: function() {
    return path.isAbsolute(this.toString())
  },

  isRelative: function() {
    return !path.isAbsolute(this.toString())
  },

  isRoot: function() {
    return this.cleanpath().toString() === path.parse(this.toString()).root
  },

  join: function() {
    let args = Array.from(arguments)
    return new Pathname(path.join.apply(this, [this.toString()].concat(args)))
  },

  parent: function() {
    return this.join('..')
  },

  relativePathFrom: function(base) {
    return new Pathname(path.relative(base.toString(), this.toString()))
  },

  split: function() {
    return [this.dirname(), this.basename()]
  },

  stat: function(callback) {
    if (typeof callback === 'function') {
      fs.stat(this.toString(), callback)
    } else {
      return fs.statSync(this.toString())
    }
  },

  sub: function(pattern, replace) {
    return new Pathname(this.toString().replace(pattern, replace))
  },

  subExt: function(ext) {
    return this.dirname().join(this.basename(this.extname()).toString() + ext)
  },

  toString: function() {
    return this._filepath
  }
}

module.exports = Pathname
