'use strict'

const fs   = require('fs')
const path = require('path')
const utils = require('./lib/util')
const statMethod = utils.statMethod
const statSubMethod = utils.statSubMethod
const accessMethod = utils.accessMethod

/**
 * Pathname represents the name of a file or directory on the filesystem, but not the file itself.
 * @class
 * @param {String} filepath
 */
function Pathname(filepath) {
  this._filepath = filepath
}

Pathname.prototype = {
  /**
   * Returns an array of path elements in ascending order.
   * @return {Array<Pathname>}
   */
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

  /**
   * Returns the last access time for the file.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Date|null}
   * @see Stat time values at {@link https://nodejs.org/api/fs.html#fs_stat_time_values}
   * @example
   * pathname.atime((error, atime) => console.log(atime))
   * console.log(pathname.atime())
   */
  atime: statSubMethod('atime'),

  /**
   * Returns the last component of the path.
   * @return {Pathname}
   * @see path.basename at {@link https://nodejs.org/api/path.html#path_path_basename_path_ext}
   */
  basename: function(ext) {
    return new Pathname(path.basename(this.toString(), ext))
  },

  /**
   * Returns the birth time for the file.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Date|null}
   * @see Stat time values at {@link https://nodejs.org/api/fs.html#fs_stat_time_values}
   * @example
   * pathname.birthtime((error, birthtime) => console.log(birthtime))
   * console.log(pathname.birthtime())
   */
  birthtime: statSubMethod('birthtime'),

  /**
   * Returns clean pathname of self with consecutive slashes and useless dots removed.
   * The filesystem is not accessed.
   * @return {Pathname}
   * @see path.normalize at {@link https://nodejs.org/api/path.html#path_path_normalize_path}
   */
  cleanpath: function() {
    return new Pathname(path.normalize(this.toString()))
  },

  /**
   * Returns the last change time for the file.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Date|null}
   * @see Stat time values at {@link https://nodejs.org/api/fs.html#fs_stat_time_values}
   * @example
   * pathname.ctime((error, ctime) => console.log(ctime))
   * console.log(pathname.ctime())
   */
  ctime: statSubMethod('ctime'),

  /**
   * Returns an array of path elements in descending order.
   * @return {Array<Pathname>}
   */
  descend: function() {
    return this.ascend().reverse()
  },

  /**
   * Returns all but the last component of the path.
   * @return {Pathname}
   * @see path.dirname at {@link https://nodejs.org/api/path.html#path_path_dirname_path}
   */
  dirname: function() {
    return new Pathname(path.dirname(this.toString()))
  },

  /**
   * Iterates over each component of the path.
   * @param {function} callback
   * @example
   * new Pathname('/usr/bin/node').eachFilename(filename => console.log(filename))
   * // => "usr"
   * // => "bin"
   * // => "node"
   */
  eachFilename: function(callback) {
    this.toString().split(path.sep).forEach(filepath => {
      if (filepath) { callback(filepath) }
    })
  },

  /**
   * Returns the absolute path for the file.
   * @return {Pathname}
   * @see path.resolve at {@link https://nodejs.org/api/path.html#path_path_resolve_paths}
   */
  expandPath: function(defaultDir) {
    return new Pathname(path.resolve(defaultDir || '.', this.toString()))
  },

  /**
   * Returns the file’s extension.
   * @return {String}
   * @see path.extname at {@link https://nodejs.org/api/path.html#path_path_extname_path}
   */
  extname: function() {
    return path.extname(this.toString())
  },

  /**
   * Returns file type as constants.
   * If callback given, this works asynchronously.
   * @param {function} [callback]
   * @return {Number|null}
   * @see File type constants at {@link https://nodejs.org/api/fs.html#fs_file_type_constants}
   * @example
   * const fs = require('fs')
   * pathname.fileType((error, type) => console.log(type & fs.constants.S_IFREG ? 'file' : 'not file'))
   * console.log(pathname.fileType() & fs.constants.S_IFREG ? 'file' ? 'not file')
   */
  fileType: function(callback) {
    if (typeof callback === 'function') {
      this.stat((error, stats) => callback(error, stats.mode & fs.constants.S_IFMT))
    } else {
      return this.stat().mode & fs.constants.S_IFMT
    }
  },

  /**
   * Predicate method for testing whether a path is absolute.
   * @return {Boolean}
   */
  isAbsolute: function() {
    return path.isAbsolute(this.toString())
  },

  /**
   * Predicate method for testing whether the target of the path is a block device.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   * @see fs.Stats at {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
   * @example
   * pathname.isBlockDevice((error, result) => console.log(result))
   * console.log(pathname.isBlockDevice())
   */
  isBlockDevice: statSubMethod('isBlockDevice'),

  /**
   * Predicate method for testing whether the target of the path is a character device.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   * @see fs.Stats at {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
   * @example
   * pathname.isCharacterDevice((error, result) => console.log(result))
   * console.log(pathname.isCharacterDevice())
   */
  isCharacterDevice: statSubMethod('isCharacterDevice'),

  /**
   * Predicate method for testing whether the target of the path is a directory.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   * @see fs.Stats at {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
   * @example
   * pathname.isDirectory((error, result) => console.log(result))
   * console.log(pathname.isDirectory())
   */
  isDirectory: statSubMethod('isDirectory'),

  /**
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isEmpty: function(callback) {
    if (typeof callback === 'function') {
      this.size((error, size) => callback(error, size === 0))
    } else {
      return this.size() === 0
    }
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isExecutable: accessMethod(0b001),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isExist: accessMethod(0b0),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isFIFO: statSubMethod('isFIFO'),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isFile: statSubMethod('isFile'),

  /**
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isGroupOwned: function(callback) {
    if (typeof callback === 'function') {
      this.stat((error, stats) => callback(error, stats.gid === process.getegid()))
    } else {
      this.stat().gid === process.getegid()
    }
  },

  /**
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isOwned: function(callback) {
    if (typeof callback === 'function') {
      this.stat((error, stats) => callback(error, stats.uid === process.geteuid()))
    } else {
      return this.stat().uid === process.geteuid()
    }
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isPipe: statSubMethod('isFIFO'),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isReadable: accessMethod(0b100),

  /**
   * @return {Boolean}
   */
  isRelative: function() {
    return !path.isAbsolute(this.toString())
  },

  /**
   * @return {Boolean}
   */
  isRoot: function() {
    return this.cleanpath().toString() === path.parse(this.toString()).root
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isSocket: statSubMethod('isSocket'),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isSymbolicLink: statSubMethod('isSymbolicLink', 'lstat'),

  /**
   * @method
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isWritable: accessMethod(0b010),

  /**
   * @param {function} [callback]
   * @return {Boolean|null}
   */
  isZero: function(callback) {
    if (typeof callback === 'function') {
      this.size((error, size) => callback(error, size === 0))
    } else {
      return this.size() === 0
    }
  },

  /**
   * @param {...Object} arguments objects with #toString method.
   * @return {Pathname}
   */
  join: function() {
    let args = Array.from(arguments)
    return new Pathname(path.join.apply(this, [this.toString()].concat(args)))
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {fs.Stats|null}
   */
  lstat: statMethod('lstat'),

  /**
   * Returns the last modified time for the file.
   * If callback given, this works asynchronously.
   * @method
   * @param {function} [callback]
   * @return {Date|null}
   * @see Stat time values at {@link https://nodejs.org/api/fs.html#fs_stat_time_values}
   * @example
   * pathname.mtime((error, mtime) => console.log(mtime))
   * console.log(pathname.mtime())
   */
  mtime: statSubMethod('mtime'),

  /**
   * @return {Pathname{
   */
  parent: function() {
    return this.join('..')
  },

  /**
   * @param {Object} base object with #toString() method.
   * @return {Pathname}
   */
  relativePathFrom: function(base) {
    return new Pathname(path.relative(base.toString(), this.toString()))
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {Number|null}
   */
  size: statSubMethod('size'),

  /**
   * @return {Array<Pathname>}
   */
  split: function() {
    return [this.dirname(), this.basename()]
  },

  /**
   * @method
   * @param {function} [callback]
   * @return {fs.Stats|null}
   */
  stat: statMethod('stat'),

  /**
   * @param {String|RegExp} pattern
   * @param {String} replace
   * @return {Pathname}
   */
  sub: function(pattern, replace) {
    return new Pathname(this.toString().replace(pattern, replace))
  },

  /**
   * @param {String} ext
   * @return {Pathname}
   */
  subExt: function(ext) {
    return this.dirname().join(this.basename(this.extname()).toString() + ext)
  },

  /**
   * @return {String}
   */
  toString: function() {
    return this._filepath
  },
}

module.exports = Pathname
