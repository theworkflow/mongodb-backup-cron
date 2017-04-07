const { expect } = require('code')
const lab = require('lab')

const cron = require('../src/cron')
const { CronJob } = require('cron')

const { describe, it } = exports.lab = lab.script()

describe('src/cron', () => {
  const task = () => console.log('running job')
  it('returns a cronjob', (done) => {
    const job = cron({ task })
    expect(job).to.be.instanceof(CronJob)
    done()
  })
})
