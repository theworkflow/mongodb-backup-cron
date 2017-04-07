const { expect } = require('code')
const lab = require('lab')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const unlinkStub = sinon.stub()
const cleanup = proxyquire('../src/cleanup', {
  fs: { unlink: unlinkStub }
})
const { afterEach, beforeEach, describe, it } = exports.lab = lab.script()

describe('src/cleanup', () => {
  let date, options

  beforeEach((done) => {
    date = new Date()
    options = { directory: process.cwd(), date }
    unlinkStub.yields()
    done()
  })

  afterEach((done) => {
    unlinkStub.reset()
    done()
  })

  describe('fs.unlink fails to remove tar file', () => {
    beforeEach((done) => {
      unlinkStub.yields(new Error('fs.unlink error'))
      done()
    })

    it('yields an error removing tar file', (done) => {
      cleanup(options)((err) => {
        expect(err.message).to.equal('fs.unlink error')
        done()
      })
    })
  })

  it('removes option.directory dir and tar file', (done) => {
    cleanup(options)((err) => {
      expect(err).to.not.exist()
      expect(unlinkStub.calledWith(`${options.directory}/${date}.tar.gz`)).to.be.true()
      done()
    })
  })
})
