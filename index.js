const assert = require('assert')
const os = require('os')
const waterfall = require('run-waterfall')

const backup = require('./src/backup')
const cleanup = require('./src/cleanup')
const cron = require('./src/cron')
const logger = require('./src/logger')
const s3 = require('./src/s3')

const isString = (arg) => (typeof arg === 'string' || arg instanceof String)

const isInvalidOptions = (options) => {
  try {
    assert(isString(options.uri), '`uri` must be a String')
    assert(isString(options.accessKeyId), '`accessKeyId` must be a String')
    assert(isString(options.secretAccessKey), '`secretAccessKey` must be a String')
    assert(isString(options.bucket), '`bucket` must be a String')
    return false
  } catch (err) {
    return err
  }
}

exports.backup = (options, done) => {
  options = Object.assign({
    retry: 3
  }, options, {
    date: new Date(),
    directory: os.tmpdir()
  })

  const invalid = isInvalidOptions(options)
  if (invalid) return done(invalid)

  const operations = [
    backup(options), s3(options), cleanup(options)
  ]

  waterfall(operations, done)
}

exports.cron = (options, done) => {
  const task = () => {
    logger.debug('cron', 'starting backup')
    exports.backup(options, (err) => {
      if (err) logger.error('cron', err)
    })
  }

  const job = cron(task, options)

  job.start()
  return job
}
