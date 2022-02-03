import { makePrice } from 'core/price'
import { Store, makeListing } from 'core/listing'
import { ListingSize, parseSizeString, Units, GRAMS_PER_KG } from 'core/size'
import { format } from 'date-fns'
import { SortOption, CommonConfig, Result } from './common.types'

export const FETCHABLE_PAGES = 101
export const TITLE_ASC: SortOption = { title: 'asc' }
export const TITLE_DESC: SortOption = { title: 'desc' }

export const commonConfig: CommonConfig = {
  apiKey: '1im1hL52q9xvta16GlSdYDsTsG0dmyhF',
  pageSize: 48,
  date: format(new Date(), 'ddMMyyyy'),
  lang: 'fr',
  pickupType: 'STORE',
}

export function makeListingFromLoblawRawResult(
  result: Result,
  store: Store,
  baseLink: string,
  date = new Date()
) {
  const size = getListingSize(result)
  const price = makePrice(
    size,
    result.prices.price.value,
    date,
    result.badges.dealBadge?.type === 'SALE'
  )

  return makeListing({
    addedDate: date,
    lastUpdatedDate: date,

    code: result.code,
    store,
    brand: result.brand,
    name: result.name,
    size,
    price,
    image: result.imageAssets[0].smallUrl,
    link: `${baseLink}${result.link}`,
    pastPrices: [],
  })
}

export function getListingSize(result: Result): ListingSize {
  if (result.packageSize) {
    const size = parseSizeString(result.packageSize)
    return {
      quantity: size.quantity,
      unit: size.unit,
      value: size.value,
    }
  }
  const listingSize: ListingSize = {
    quantity: 1,
    value:
      result.prices.price.quantity !== 1 ? result.prices.price.quantity : 1000,
    unit: Units.g,
  }
  if (result.averageWeight) {
    listingSize.averageWeight = parseFloat(result.averageWeight) * GRAMS_PER_KG
  }
  return listingSize
}

export function combineArrays(arrays: Array<any>) {
  return arrays.reduce((res, cur) => res.concat(cur), [])
}

export function removeDuplicates(arr: Result[]): Result[] {
  return arr.reduce(
    (res, cur) =>
      res.find((r: Result) => r.code === cur.code) ? res : res.concat(cur),
    []
  )
}
