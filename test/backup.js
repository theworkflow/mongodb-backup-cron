const { expect } = require('code')
const lab = require('lab')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

let backupStub = sinon.stub()
const backup = proxyquire('../src/backup', {
  'mongodb-backup': backupStub
})

const { before, describe, it } = exports.lab = lab.script()

describe('src/backup', () => {
  let date, directory, options, uri

  before((done) => {
    date = new Date()
    directory = __dirname
    uri = 'mongodb://localhost:27017'
    options = { date, directory, uri }

    backupStub.yieldsTo('callback')
    done()
  })

  it('passes arguments to backup tool', (done) => {
    backup(options)(() => {
      const call = backupStub.getCall(0).args[0]
      expect(call).to.include({
        root: __dirname,
        uri: 'mongodb://localhost:27017',
        tar: `${date}.tar.gz`
      })

      done()
    })
  })
})
