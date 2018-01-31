const {
  launchBrowser,
  getNewPage,
  closeBrowser,
} = require('../utils/utils')

async function handleRequest(args) {

  const searchTerm = args.urlParam || args.searchTerm

  if (!searchTerm) {
    console.log('/!\\ Search term empty...')
    throw new Error('/!\\ Search term empty...')
  }

  const browser = await launchBrowser()
  const page = await getNewPage(browser)

  await page.goto('https://google.com')

  // Type in search box
  await page.type('#lst-ib', searchTerm)

  // Submit search form
  const googleSearchButton = await page.$('input[type=submit]')
  await googleSearchButton.click()

  console.log('waitForNavigation()...')
  await page.waitForNavigation()
  console.log('After waitForNavigation()')

  let firstResultTitle = ''

  // Return title of first result
  const element = await page.$('h3.r a')
  if (element) {
    firstResultTitle = await page.evaluate(() => document.body.querySelector('h3.r a').innerText)
    console.log('firstResultTitle', firstResultTitle)
  }

  await closeBrowser(browser)

  return firstResultTitle
}

module.exports = {
  handleRequest
}
