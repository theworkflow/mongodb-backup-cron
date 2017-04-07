const fs = require('fs')

const logger = require('./logger')

module.exports = ({ date, directory }) => (done) => {
  logger.debug('cleanup', directory)
  fs.unlink(`${directory}/${date}.tar.gz`, done)
}
