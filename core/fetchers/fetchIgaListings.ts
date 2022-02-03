import { format } from 'date-fns'
import * as cheerio from 'cheerio'
import chromium from 'chrome-aws-lambda'
import { FetchFunction, ListingsMapping } from 'core/fetchFunction'
import { makePrice } from 'core/price'
import { Listing, makeListing, Store } from 'core/listing'
import { parseSizeString } from 'core/size'
import { clearTmpDir, isInTmp, getFromTmp, storeInTmp } from 'lib/tmp'
import { IgaResult } from './fetchIgaListings.types'
import { Browser } from 'puppeteer'

export const fetchIgaListings: FetchFunction = async (date, clearTmp) => {
  if (clearTmp) clearTmpDir(getDatePath(date))
  const fetcher = new IgaFetcher()
  const results = await fetcher.fetchAllIgaRawResults(date)
  return fetcher.makeListingsFromIgaRawResults(results, date)
}

class IgaFetcher {
  browser: Browser

  makeListingsFromIgaRawResults(
    results: IgaResult[],
    date: Date
  ): ListingsMapping {
    return results.reduce<ListingsMapping>(
      (acc, cur) => {
        try {
          const listing = this.makeListingFromIgaRawResult(cur, date)
          return {
            listings: acc.listings.concat(listing),
            parsingFailures: acc.parsingFailures,
          }
        } catch (error) {
          return {
            listings: acc.listings,
            parsingFailures: acc.parsingFailures.concat({ error, result: cur }),
          }
        }
      },
      { listings: [], parsingFailures: [] }
    )
  }

  makeListingFromIgaRawResult(result: IgaResult, date: Date): Listing {
    const size = parseSizeString(result.Size)
    const price = makePrice(
      size,
      result.SalesPrice || result.RegularPrice,
      date,
      !!result.SalesPrice
    )

    return makeListing({
      addedDate: date,
      lastUpdatedDate: date,
      code: result.ProductId,
      store: Store.iga,
      brand: result.BrandName,
      name: result.FullDisplayName,
      size,
      price,
      image: result.ProductImageUrl,
      link: `https://www.iga.net${result.ProductUrl}`,
      pastPrices: [],
    })
  }

  async fetchAllIgaRawResults(date: Date): Promise<IgaResult[]> {
    if (isInTmp(getDataPath(date))) return getFromTmp(getDataPath(date))

    this.browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      headless: false,
      args: [...chromium.args, '--disable-gpu'],
    })

    const promises = Array.from(Array(50).keys()).map((pageNo) =>
      this.fetchPageResults(pageNo, 400, date)
    )
    const pagesResults = await Promise.all(promises)

    await this.browser.close()

    const allResults = pagesResults.reduce((res, cur) => res.concat(cur), [])
    storeInTmp(getDataPath(date), allResults)
    return allResults
  }

  async fetchPageResults(
    pageNo: number,
    pageSize: number,
    date: Date
  ): Promise<any[]> {
    if (isInTmp(getPagePath(pageNo, date))) {
      return getFromTmp(getPagePath(pageNo, date))
    }

    const base = `https://www.iga.net/fr/epicerie_en_ligne/parcourir?pageSize=${pageSize}`
    const url = new URL(base)
    if (pageNo) url.searchParams.append('page', pageNo.toString())

    const page = await this.browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.setJavaScriptEnabled(false)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    )
    await page.setExtraHTTPHeaders({
      'Accept-Language':
        'fr-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,en-GB;q=0.6,en-US;q=0.5',
    })
    await page.setRequestInterception(true)
    await page.setViewport({
      width: 1920,
      height: 947,
    })
    page.on('request', (request) => {
      if (request.resourceType() === 'document') request.continue()
      else request.abort()
    })
    await page.goto(url.toString())

    const rawHtml = await page.content()
    const $ = cheerio.load(rawHtml)
    const listingsDivs = $(
      '#body_0_main_1_ProductSearch_GroceryBrowsing_TemplateResult_SearchResultListView_MansoryPanel > div > div > div'
    ).toArray()
    const listingsDivsDataProduct = listingsDivs.map(
      (node: cheerio.TagElement) =>
        node.attribs['data-product'].replace(/'/g, '"')
    )
    const pageResults = listingsDivsDataProduct.map((data) => JSON.parse(data))
    storeInTmp(getPagePath(pageNo, date), pageResults)
    return pageResults
  }
}

function getPagePath(no: number, date: Date) {
  return `${getDatePath(date)}/${no}.json`
}

function getDataPath(date: Date) {
  return `${getDatePath(date)}/results.json`
}

function getDatePath(date: Date) {
  return `iga/${format(date, 'yyyyMMdd')}`
}
