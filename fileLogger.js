function getFileLogger() {

  const fs = require('fs')
  const log_file = fs.createWriteStream(__dirname + '/out.log', { flags : 'a' })
  const log_stdout = process.stdout

  return function(...logLine) {
    log_file.write(`${new Date(Date.now()).toLocaleString()} - ${logLine.join(' ')}\n`)
    log_stdout.write(logLine.join(' ') + '\n')
  }
}

module.exports = {
  getFileLogger,
}
