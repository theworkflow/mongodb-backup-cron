const { basename } = require('path')
const s3 = require('s3')

const Logger = require('./logger')

const getS3Options = (options) => ({
  uploaderOptions: {
    localFile: `${options.directory}/${options.date}.tar.gz`,
    s3Params: {
      Bucket: options.bucket,
      Key: basename(`${options.directory}/${options.date}.tar.gz`),
      ACL: 'private'
    }
  },
  clientOptions: {
    s3RetryCount: options.retry,
    s3Options: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey
    }
  }
})

module.exports = (options) => (done) => {
  Logger.debug('s3', { bucket: options.bucket })

  const { clientOptions, uploaderOptions } = getS3Options(options)
  const client = s3.createClient(clientOptions)
  const uploader = client.uploadFile(uploaderOptions)

  uploader.on('error', done)
  uploader.on('progress', () => {
    const { progressMd5Amount, progressAmount, progressTotal } = uploader
    Logger.debug('progress', progressMd5Amount, progressAmount, progressTotal)
  })

  uploader.on('end', (data) => {
    Logger.debug('s3', { data })
    done()
  })
}
