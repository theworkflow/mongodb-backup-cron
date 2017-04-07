const { CronJob } = require('cron')

module.exports = ({ task, options }) => {
  options = Object.assign({
    schedule: '0 0,12 * * *',
    start: false,
    timeZone: 'America/New_York'
  }, options)

  return new CronJob({
    cronTime: options.schedule,
    onTick: task,
    start: options.start,
    timeZone: options.timezone
  })
}
