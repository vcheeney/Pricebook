import chromium from 'chrome-aws-lambda'
import * as cheerio from 'cheerio'
import { makePrice } from 'core/price'
import { Listing, makeListing, Store } from 'core/listing'
import { parseSizeString } from 'core/size'

export const fetchMetroListing = async (url: string): Promise<Listing> => {
  const rawHtml = await fetchMetroListingPageHtml(url)
  return makeListingFromMetroListingPageHtml(rawHtml)
}

export const fetchMetroListingPageHtml = async (
  url: string
): Promise<string> => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    headless: true,
    args: [...chromium.args, '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  )
  await page.setJavaScriptEnabled(false)
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.resourceType() === 'document') request.continue()
    else request.abort()
  })
  await page.goto(url)
  const rawHtml = await page.content()
  await browser.close()
  return rawHtml
}

export const makeListingFromMetroListingPageHtml = (
  rawHtml: string
): Listing => {
  const $ = cheerio.load(rawHtml)

  const sizeString = $('.pi--weight').text()
  const priceVal = $('.pi--main-price').data('main-price')
  const isSale = !!$('.pi-price .price-update .pi-price-promo').length

  const size = parseSizeString(sizeString)
  const price = makePrice(size, priceVal, new Date(), isSale)

  return makeListing({
    code: $('.pi--title').text(),
    store: Store.metro,
    name: $('.pi--title').text(),
    price,
    size,
  })
}
