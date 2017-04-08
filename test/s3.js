const os = require('os')

const { EventEmitter } = require('events')
const { expect } = require('code')
const lab = require('lab')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

let clientStub = {}
let s3Stub = {}
const s3 = proxyquire('../src/s3', {
  's3': s3Stub
})

const { beforeEach, describe, it } = exports.lab = lab.script()

describe('src/s3', () => {
  let date, emitter, options

  beforeEach((done) => {
    date = new Date()
    emitter = new EventEmitter()
    clientStub.uploadFile = sinon.stub().returns(emitter)
    s3Stub.createClient = sinon.stub().returns(clientStub)
    options = {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      bucket: 'bucket',
      directory: os.tmpdir(),
      retry: 3,
      date
    }

    done()
  })

  it('builds s3 options', (done) => {
    const uploaderOptions = {
      localFile: `${os.tmpdir()}/${date}.tar.gz`,
      s3Params: {
        Bucket: 'bucket',
        Key: `${date}.tar.gz`,
        ACL: 'private'
      }
    }

    const s3Options = {
      s3RetryCount: 3,
      s3Options: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey'
      }
    }

    s3(options)(() => {
      expect(s3Stub.createClient.calledWith(s3Options)).to.be.true()
      expect(clientStub.uploadFile.calledWith(uploaderOptions)).to.be.true()
      done()
    })

    emitter.emit('end')
  })

  it('uses options.retry if supplied', (done) => {
    options.retry = 10
    const uploaderOptions = {
      localFile: `${os.tmpdir()}/${date}.tar.gz`,
      s3Params: {
        Bucket: 'bucket',
        Key: `${date}.tar.gz`,
        ACL: 'private'
      }
    }

    const s3Options = {
      s3RetryCount: 10,
      s3Options: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey'
      }
    }

    s3(options)(() => {
      expect(s3Stub.createClient.calledWith(s3Options)).to.be.true()
      expect(clientStub.uploadFile.calledWith(uploaderOptions)).to.be.true()
      done()
    })

    emitter.emit('end')
  })

  it('has a handler for progress emission', (done) => {
    s3(options)(done)
    emitter.emit('progress')
    emitter.emit('end')
  })

  it('yields an error when emitted', (done) => {
    const errMessage = new Error('emitter error')
    s3(options)((err) => {
      expect(err).to.equal(err)
      done()
    })

    emitter.emit('error', errMessage)
  })
})
