const puppeteer = require('puppeteer')

async function handle() {

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://google.com')
  await page.screenshot({
    path: 'screenshots/01_arrivingAtPage.png'
  })

  // Type in search box
  await page.type('#lst-ib', 'Saint marcellin')
  await page.screenshot({
    path: 'screenshots/02_afterTyping.png'
  })

  // Press Enter
  // await page.keyboard.press('Enter')
  // await page.keyboard.press('Enter')
  // await page.keyboard.press('Enter')
  const googleSearchButton = await page.$('input[type=submit]')
  // console.log('googleSearchButton', googleSearchButton)
  // await page.click('[value="Google Search"]')
  await googleSearchButton.click()

  console.log('waitForNavigation()...')
  await page.waitForNavigation()
  console.log('After waitForNavigation()')

  await page.screenshot({
    path: 'screenshots/03_afterPressingEnter.png'
  })

  // Return title of first result
  const element = await page.$('h3.r a')
  if (element) {
    const innerText = await page.evaluate(() =>
      document.body.querySelector('h3.r a').innerText)

    // const firstResultTitle = element.innerText
    console.log('firstResultTitle', innerText)

    console.log('Closing browser...')
    await browser.close()
    console.log('Browser closed')

    return innerText
  } else {

    console.log('Closing browser...')
    await browser.close()
    console.log('Browser closed')

    return 'Nope...'
  }
}

module.exports = {
  handle
}
