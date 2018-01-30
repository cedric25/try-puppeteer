const { openPage, closeBrowser } = require('../utils/utils')

async function handle() {
  const page = await openPage()

  await page.goto('https://google.com')
  await page.screenshot({path: 'screenshots/example.png'})

  console.log('Closing browser...')
  await closeBrowser()
  console.log('Browser closed')

  return 'Done'
}

module.exports = {
  handle
}
