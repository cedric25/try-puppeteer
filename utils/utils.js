const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const headless = true

function launchBrowser() {
  return puppeteer.launch({ headless })
}

function getNewPage(browser) {
  return browser.newPage()
}

function closeBrowser(browser) {
  console.log('Closing browser...')
  return browser.close()
}

function getAvailableHandlers() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, '../handlers'), (err, dirContent) => {
      if (err) {
        console.error(`Could not read the content of the 'handlers' directory...`, err)
        reject(`Could not read the content of the 'handlers' directory...`)
        return
      }
      const answer = dirContent.map(dir => dir.split('.')[0])
      resolve(answer)
    })
  })
}

module.exports = {
  launchBrowser,
  getNewPage,
  closeBrowser,
  getAvailableHandlers,
}
