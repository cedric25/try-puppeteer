const puppeteer = require('puppeteer')

function launchBrowser() {
  return puppeteer.launch({ headless: false })
}

function getNewPage(browser) {
  return browser.newPage()
}

function closeBrowser(browser) {
  console.log('Closing browser...')
  return browser.close()
}

module.exports = {
  launchBrowser,
  getNewPage,
  closeBrowser,
}
