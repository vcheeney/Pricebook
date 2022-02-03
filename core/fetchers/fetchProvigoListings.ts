import { FetchFunction, ListingsMapping } from 'core/fetchFunction'
import { Store } from 'core/listing'
import { format } from 'date-fns'
import { clearTmpDir, isInTmp, getFromTmp, storeInTmp } from 'lib/tmp'
import {
  makeListingFromLoblawRawResult,
  combineArrays,
  removeDuplicates,
  FETCHABLE_PAGES,
  commonConfig,
  TITLE_DESC,
  TITLE_ASC,
} from './common'
import {
  BannerConfig,
  Result,
  Category,
  SortOption,
  FetchPageResponse,
} from './common.types'
import fetch from 'node-fetch'

const bannerConfig: BannerConfig = {
  categoryId: 'PVG001000000000',
  storeId: '8481',
  banner: 'provigo',
  cartId: '1165225e-224b-40dc-8451-570075e7ffec',
}

export const fetchProvigoListings: FetchFunction = async (date, clearTmp) => {
  if (clearTmp) clearTmpDir(getDatePath(date))
  const results = await fetchAllProvigoRawResults(date)
  return makeListingsFromProvigoRawResults(results, date)
}

export function makeListingsFromProvigoRawResults(
  results: Result[],
  date: Date
): ListingsMapping {
  return results.reduce<ListingsMapping>(
    (acc, cur) => {
      try {
        const listing = makeListingFromProvigoRawResult(cur, date)
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

export function makeListingFromProvigoRawResult(
  result: Result,
  date = new Date()
) {
  return makeListingFromLoblawRawResult(
    result,
    Store.provigo,
    'https://www.provigo.ca',
    date
  )
}

export async function fetchAllProvigoRawResults(date: Date): Promise<Result[]> {
  if (isInTmp(getDataPath(date))) return getFromTmp(getDataPath(date))
  const categories = await fetchProvigoCategories()
  const categoriesResults = await Promise.all(
    categories.map((category) =>
      fetchProvigoRawResultsForCategory(date, category)
    )
  )
  const allResults = combineArrays(categoriesResults)
  const allResultsWithoutDuplicate = removeDuplicates(allResults)
  storeInTmp(getDataPath(date), allResultsWithoutDuplicate)
  return allResultsWithoutDuplicate
}

export async function fetchProvigoRawResultsForCategory(
  date: Date,
  category: string
): Promise<Result[]> {
  if (isInTmp(getDataPath(date, category))) {
    return getFromTmp(getDataPath(date, category))
  }
  const pagesAmount = await getPagesAmountForCategory(date, category)
  const pagesResults =
    pagesAmount <= FETCHABLE_PAGES
      ? await fetchPagesResults(date, category, pagesAmount)
      : await fetchPagesResultsAscAndDesc(date, category, FETCHABLE_PAGES)
  const categoryResults = combineArrays(pagesResults)
  storeInTmp(getDataPath(date, category), categoryResults)
  return categoryResults
}

async function getPagesAmountForCategory(
  date: Date,
  category: string
): Promise<number> {
  const page = await fetchPageForCategory(0, date, category)
  return Math.ceil(page.pagination.totalResults / commonConfig.pageSize)
}

export async function fetchProvigoCategories(): Promise<string[]> {
  const data = await fetch(
    'https://www.provigo.ca/api/category/PVG001000000000',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en',
        adrum: 'isAjax:true',
        'content-type': 'application/json;charset=utf-8',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'site-banner': 'maxi',
      },
      body: null,
      method: 'GET',
    }
  )
  const res: Category = await data.json()
  return res.subCategories
}

export async function fetchPagesResults(
  date: Date,
  category: string,
  pagesAmount: number,
  sort?: SortOption
) {
  return Promise.all(
    Array.from(Array(pagesAmount).keys()).map(
      async (pageNo) =>
        (await fetchPageForCategory(pageNo, date, category, sort)).results
    )
  )
}

export async function fetchPagesResultsAscAndDesc(
  date: Date,
  category: string,
  pagesAmount: number
) {
  const pagesAscResults = await fetchPagesResults(date, category, pagesAmount)
  const pagesDescResults = await fetchPagesResults(
    date,
    category,
    pagesAmount,
    TITLE_DESC
  )
  return [...pagesAscResults, ...pagesDescResults]
}

export async function fetchPageForCategory(
  no: number,
  date: Date,
  category: string,
  sort = TITLE_ASC
): Promise<FetchPageResponse> {
  const computedNo = sort === TITLE_DESC ? `r${no}` : `${no}`
  if (isInTmp(getPagePath(computedNo, date, category))) {
    return (getFromTmp(
      getPagePath(computedNo, date, category)
    ) as unknown) as FetchPageResponse
  }
  console.log(`Fetching page ${computedNo} for category ${category}...`)
  const response = await fetch(
    'https://api.pcexpress.ca/v2/products/category/listing',
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'x-apikey': commonConfig.apiKey,
      },
      body: JSON.stringify({
        pagination: { from: no, size: commonConfig.pageSize },
        categoryId: category,
        date: format(date, 'ddMMyyyy'),
        storeId: bannerConfig.storeId,
        banner: bannerConfig.banner,
        cartId: bannerConfig.cartId,
        lang: commonConfig.lang,
        pickupType: commonConfig.pickupType,
        sort,
      }),
      method: 'POST',
    }
  )
  console.log(`Fetched page ${computedNo} for category ${category}.`)
  const page = await response.json()
  storeInTmp(getPagePath(computedNo, date, category), page)
  return page
}

function getDataPath(date: Date, category?: string) {
  if (category) return `${getDatePath(date)}/${category}.json`
  return `${getDatePath(date)}/results.json`
}

function getPagePath(no: string, date: Date, category: string) {
  return `${getDatePath(date)}/${category}/${no}.json`
}

function getDatePath(date: Date) {
  return `provigo/${format(date, 'yyyyMMdd')}`
}
