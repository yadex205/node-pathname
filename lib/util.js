const fs = require('fs')

module.exports = {
  statMethod: function(statType) {
    return function(callback) {
      if (typeof callback === 'function') {
        fs[statType](this.toString(), callback)
      } else {
        return fs[statType + 'Sync'](this.toString())
      }
    }
  },

  statSubMethod: function(name, statType) {
    statType = statType || 'stat'
    return function(callback) {
      if (typeof callback === 'function') {
        this[statType]((error, stats) => {
          callback(error, typeof stats[name] === 'function' ? stats[name]() : stats[name])
        })
      } else {
        let stats = this[statType]()
        return typeof stats[name] === 'function' ? stats[name]() : stats[name]
      }
    }
  },

  accessMethod: function(condition) {
    return function(callback) {
      if (typeof callback === 'function') {
        fs.access(this.toString(), condition, error => callback(error, !error))
      } else {
        try {
          fs.accessSync(this.toString(), condition)
          return true
        } catch (e) {
          return false
        }
      }
    }
  }
}
