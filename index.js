'use strict'

const path = require('path')

function Pathname(filepath) {
  this._filepath = filepath
}

Pathname.prototype = {
  basename: function(ext) {
    return new Pathname(path.basename(this.toString(), ext))
  },

  cleanpath: function() {
    return new Pathname(path.normalize(this.toString()))
  },

  dirname: function() {
    return new Pathname(path.dirname(this.toString()))
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

  join: function() {
    let args = Array.from(arguments)
    return new Pathname(path.join.apply(this, [this.toString()].concat(args)))
  },

  toString: function() {
    return this._filepath
  }
}

module.exports = Pathname
