const backup = require('mongodb-backup')

const logger = require('./logger')

module.exports = ({ date, directory, uri } = {}) => (done) => {
  logger.debug('backup', uri, directory)
  const tar = `${date}.tar.gz`

  backup({ root: directory, uri, tar, callback: done })
}
