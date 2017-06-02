const expect   = require('chai').expect
const Pathname = require('..')
const fs       = require('fs')

describe('Pathname', () => {
  'use strict'

  describe('#ascend', () => {
    context('when /foo/bar/baz', () => {
      let pathname = new Pathname('/foo/bar/baz')
      let subject = pathname.ascend().map(val => val.toString())

      it ('should be ["/foo/bar/baz", "/foo/bar", "/foo", "/"]', () => {
        expect(subject).to.eql(['/foo/bar/baz', '/foo/bar', '/foo', '/'])
      })
    })

    context('when foo/bar/baz', () => {
      let pathname = new Pathname('foo/bar/baz')
      let subject = pathname.ascend().map(val => val.toString())

      it('should be ["foo/bar/baz", "foo/bar", "foo"]', () => {
        expect(subject).to.eql(['foo/bar/baz', 'foo/bar', 'foo'])
      })
    })

    context('when path is "."', () => {
      let pathname = new Pathname('.')
      it('should be ["."]', () => {
        expect(pathname.ascend().map(val => val.toString())).to.eql(['.'])
      })
    })

    context('when path is "/"', () => {
      let pathname = new Pathname('/')
      it('should be ["/"]', () => {
        expect(pathname.ascend().map(val => val.toString())).to.eql(['/'])
      })
    })
  })

  describe('#basename', () => {
    it('should return "bar"', () => {
      expect(new Pathname('foo/bar').basename().toString()).to.eql('bar')
    })

    it('should return "bar"', () => {
      expect(new Pathname('foo/bar.baz').basename('.baz').toString()).to.eql('bar')
    })
  })

  describe('#cleanpath', () => {
    it('should return "foo"', () => {
      expect(new Pathname('./foo/bar/./../baz/..').cleanpath().toString()).to.eql('foo')
    })
  })

  describe('#descend', () => {
    context('when /foo/bar/baz', () => {
      let pathname = new Pathname('/foo/bar/baz')
      let subject = pathname.descend().map(val => val.toString())

      it ('should be ["/", "/foo", "/foo/bar", "/foo/bar/baz"]', () => {
        expect(subject).to.eql(['/', '/foo', '/foo/bar', '/foo/bar/baz'])
      })
    })

    context('when foo/bar/baz', () => {
      let pathname = new Pathname('foo/bar/baz')
      let subject = pathname.descend().map(val => val.toString())

      it('should be ["foo", "foo/bar", "foo/bar/baz"]', () => {
        expect(subject).to.eql(['foo', 'foo/bar', 'foo/bar/baz'])
      })
    })

    context('when path is "."', () => {
      let pathname = new Pathname('.')
      it('should be ["."]', () => {
        expect(pathname.descend().map(val => val.toString())).to.eql(['.'])
      })
    })

    context('when path is "/"', () => {
      let pathname = new Pathname('/')
      it('should be ["/"]', () => {
        expect(pathname.descend().map(val => val.toString())).to.eql(['/'])
      })
    })
  })

  describe('#dirname', () => {
    it('should return "foo"', () => {
      expect(new Pathname('foo/bar').dirname().toString()).to.eql('foo')
    })
  })

  describe('#eachFilename', () => {
    context('when absolute path given', () => {
      let pathname = new Pathname('/foo/bar')
      it('should makes result to be ["foo", "bar"]', () => {
        let result = []
        pathname.eachFilename(filepath => result.push(filepath))
        expect(result).to.eql(['foo', 'bar'])
      })
    })

    context('when relative path given', () => {
      let pathname = new Pathname('foo/bar')
      it('should makes result to be ["foo", "bar"]', () => {
        let result = []
        pathname.eachFilename(filepath => result.push(filepath))
        expect(result).to.eql(['foo', 'bar'])
      })
    })

    context('when "/" givn', () => {
      let pathname = new Pathname('/')
      it('should make result to be empty', () => {
        let result = []
        pathname.eachFilename(filepath => result.push(filepath))
        expect(result).to.be.empty
      })
    })

    context('when "." givn', () => {
      let pathname = new Pathname('.')
      it('should make result to be ["."]', () => {
        let result = []
        pathname.eachFilename(filepath => result.push(filepath))
        expect(result).to.eql(['.'])
      })
    })
  })

  describe('#expandPath', () => {
    context('with no defaultDir', () => {
      let pathname = new Pathname('foo/bar')
      it('should return an absolute path', () => {
        expect(pathname.expandPath().toString()).to.eql(process.cwd() + '/foo/bar')
      })
    })

    context('with defaultDir', () => {
      let pathname = new Pathname('foo/bar')
      it('should return an absolute path', () => {
        expect(pathname.expandPath('/hoge').toString()).to.eql('/hoge/foo/bar')
      })
    })
  })

  describe('#extname', () => {
    it('should return ".bar"', () => {
      expect(new Pathname('foo.bar').extname()).to.eql('.bar')
    })
  })

  describe('#isAbsolute', () => {
    it('should be truthy', () => {
      expect(new Pathname('/foo').isAbsolute()).to.be.true
    })

    it('should be falsey', () => {
      expect(new Pathname('foo').isAbsolute()).to.be.false
    })
  })

  describe('#isRelative', () => {
    it('should be truthy', () => {
      expect(new Pathname('foo').isRelative()).to.be.true
    })

    it('should be falsey', () => {
      expect(new Pathname('/foo').isRelative()).to.be.false
    })
  })

  describe('#isRoot', () => {
    it('should be truthy', () => {
      expect(new Pathname('/').isRoot()).to.be.true
    })

    it('should be falsey', () => {
      expect(new Pathname('/foo').isRoot()).to.be.false
    })

    it('should be falsey', () => {
      expect(new Pathname('foo').isRoot()).to.be.false
    })

    it('should be falsey', () => {
      expect(new Pathname('.').isRoot()).to.be.false
    })
  })

  describe('#join', () => {
    it('should return "foo"', () => {
      expect(new Pathname('foo').join().toString()).to.eql('foo')
    })

    it ('should return "foo/bar/baz"', () => {
      expect(new Pathname('foo').join('bar', 'baz').toString()).to.eql('foo/bar/baz')
    })

    it ('should return "foo"', () => {
      expect(new Pathname('foo/bar').join('..').toString()).to.eql('foo')
    })
  })

  describe('#parent', () => {
    it('should return "foo"', () => {
      expect(new Pathname('foo/bar').parent().toString()).to.eql('foo')
    })

    it('should returl "/"', () => {
      expect(new Pathname('/foo').parent().toString()).to.eql('/')
    })
  })

  describe('#relativePathFrom', () => {
    let pathname = new Pathname('/hoge/foo/bar')
    let base = new Pathname('/hoge')
    it('should return a relative path', () => {
      expect(pathname.relativePathFrom(base).toString()).to.eql('foo/bar')
    })
  })

  describe('#stat', () => {
    let pathname = new Pathname(__dirname).join('../package.json')
    context('when no callback given', () => {
      it('should return fs.Stats in sync', () => {
        expect(pathname.stat()).instanceof(fs.Stats)
      })
    })

    context('when callback given', () => {
      it('should callback function with fs.Stats in async', (done) => {
        pathname.stat((error, stats) => {
          expect(stats).instanceof(fs.Stats)
          done()
        })
      })
    })
  })

  describe('#subExt', () => {
    context('when call #subExt for the path with extension', () => {
      let pathname = new Pathname('/foo.txt')
      it('should return a valid path', () => {
        expect(pathname.subExt('.csv').toString()).to.eql('/foo.csv')
      })
    })

    context('when call #subExt for the path with no extension', () => {
      let pathname = new Pathname('/foo')
      it('should return a valid path', () => {
        expect(pathname.subExt('.csv').toString()).to.eql('/foo.csv')
      })
    })
  })

  describe('#toString', () => {
    it('should return "foo/bar"', () => {
      expect(new Pathname('foo/bar').toString()).to.eql('foo/bar')
    })
  })
})
