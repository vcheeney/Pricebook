import puppeteer from 'puppeteer'

run()

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  )
  // await page.setJavaScriptEnabled(false)
  // await page.setRequestInterception(true)
  // page.on('request', (request) => {
  //   if (request.resourceType() === 'document') request.continue()
  //   else request.abort()
  // })
  await page.goto('https://www.metro.ca/en/online-grocery/search-page-1')
  await page.evaluate(() => {
    console.log('im in the page')
  })
  // await browser.close()
}
