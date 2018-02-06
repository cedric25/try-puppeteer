function getFileLogger() {

  const fs = require('fs')
  const util = require('util')
  const log_file = fs.createWriteStream(__dirname + '/out.log', { flags : 'a' })
  const log_stdout = process.stdout

  return function(logLine) {
    log_file.write(`${new Date(Date.now()).toLocaleString()} - ${util.format(logLine)}\n`)
    log_stdout.write(util.format(logLine) + '\n')
  }
}

module.exports = {
  getFileLogger,
}
