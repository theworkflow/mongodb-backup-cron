# mongodb-backup-cron

[![version](https://img.shields.io/npm/v/mongodb-backup-cron.svg?style=flat-square)][version]
[![build](https://img.shields.io/travis/theworkflow/mongodb-backup-cron/master.svg?style=flat-square)][build]
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]

> Backup mongo database on a cron schedule and send to AWS S3

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

To install globally

```
npm install mongodb-backup-cron --global
```

To install locally

```
npm install mongodb-backup-cron --save
```

## Usage

### CLI Usage

```
> mongodb-backup -h

Options:
  --uri              MongoDB uri                                      [required]
  --accessKeyId      AWS access key id                                [required]
  --secretAccessKey  AWS secret access key                            [required]
  --bucket           AWS bucket (includes path to uploaded folder)    [required]
  --retry            Number of retries for S3 upload
  -h                 Show help                                         [boolean]
```

### Module usage

To create a cron job

```js
const backup = require('mongodb-backup-cron')
const options = {
  uri: 'mongodb://localhost:27017',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  bucket: 'backup.mongo'
  schedule: '0 0,12 * * *' // every 12 hours
}

const job = backup.cron(options)
```

To run a backup

```js
const { backup } = require('mongodb-backup-cron')
const options = {
  uri: 'mongodb://localhost:27017/example',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  bucket: 'backup.mongo'
}

backup(options, (err) => {
  if (err) throw err
})
```

All options
```js
const options = {
  uri: 'mongodb://localhost:27017/example',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  bucket: 'backup.mongo',
  directory: __dirname,
  retry: 3,
  schedule: '0 0,12 * * *',
  start: true, // used to specify if cron should start once created
  timeZone: 'America/New_York'
}
```

### Configuration Files

Create [an rc file][rc] to set defaults, so you don't have to pass an
`accessKeyId` and `secretAccessKey` flag to every command.

```
# ~/.mongodb-backuprc
uri = mongodb://localhost:27017/database
accessKeyId = key
secretAccessKey = secret
bucket = bucket
```

`mongodb-backup-cron` will walk the directory tree looking for rc files, so you can create
one in the root of your organization's project directory to make the CLI
context aware.

## License

[MIT © Jeremiah Harlan.](LICENSE)  

[rc]: https://www.npmjs.com/package/rc
[version]: https://www.npmjs.com/package/s3-mongodump
[build]: https://travis-ci.org/theworkflow/s3-mongodump
[license]: https://raw.githubusercontent.com/theworkflow/s3-mongodump/master/LICENSE
