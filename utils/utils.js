const puppeteer = require('puppeteer')

let browser

async function openPage() {
  browser && await closeBrowser()
  browser = await puppeteer.launch()
  const page = await browser.newPage()
  return page
}

async function closeBrowser() {
  const closingPromise = browser.close()
  browser = null
  return closingPromise
}

module.exports = {
  openPage,
  closeBrowser
}
