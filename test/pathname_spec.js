const expect = require('chai').expect
const Pathname = require('..')

describe('Pathname', () => {
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

  describe('#dirname', () => {
    it('should return "foo"', () => {
      expect(new Pathname('foo/bar').dirname().toString()).to.eql('foo')
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

  describe('#toString', () => {
    it('should return "foo/bar"', () => {
      expect(new Pathname('foo/bar').toString()).to.eql('foo/bar')
    })
  })
})
