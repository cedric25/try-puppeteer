const {
  launchBrowser,
  getNewPage,
  closeBrowser,
} = require('../utils/utils')

async function wrapHandler(handler, params) {

  // 1) Launch the browser
  const browser = await launchBrowser()
  const page = await getNewPage(browser)

  // 2) Go to a specific page
  await page.goto('https://google.com')

  // 3) Call the handler
  console.log('>> wrapHandler / call handler')
  const answer = await handler.handleRequest(page, params)

  // 4) Close the browser
  await closeBrowser(browser)

  return answer
}

module.exports = {
  wrapHandler,
}
