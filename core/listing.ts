import md5 from 'md5'
import { ValidationError } from './errors'
import { getComparisonPrice, getPrice, ListingPrice } from './price'
import { ListingSize } from './size'

export type Listing = {
  _id?: string
  addedDate: Date
  lastUpdatedDate: Date
  unavailable?: boolean
  code: string
  store: Store
  brand: string
  name: string
  price: ListingPrice
  lastHigherPriceSeen: ListingPrice
  size: ListingSize
  image: string
  link: string
  pastPrices?: ListingPrice[]
}
export type ListingThumbnail = Omit<Listing, 'pastPrices'>
export enum Store {
  maxi = 'maxi',
  provigo = 'provigo',
  iga = 'iga',
  metro = 'metro',
}

export function makeListing(partial: Partial<Listing>): Listing {
  const {
    addedDate,
    lastUpdatedDate,
    code,
    store,
    brand,
    name,
    price,
    lastHigherPriceSeen: lastRegularPriceSeen,
    size,
    image,
    link,
    pastPrices,
  } = partial

  const errors = []

  if (!code) throw errors.push('Code is required.')
  if (!store) throw errors.push('Store is required.')
  if (!name) throw errors.push('Name is required.')
  if (!price) throw errors.push('Price is required.')
  if (!size) throw errors.push('Size is required.')
  if (!image) throw errors.push('Image is required.')
  if (!link) throw errors.push('Link is required.')
  if (!pastPrices) throw errors.push('Past prices is required.')

  if (errors.length) throw new ValidationError(errors, { partial })

  return {
    _id: md5(`${store}-${code}`),
    brand,
    addedDate,
    code,
    image,
    lastUpdatedDate,
    link,
    name,
    pastPrices,
    price,
    lastHigherPriceSeen: lastRegularPriceSeen,
    size,
    store,
  }
}

export function makeListingThumbnail(listing: Listing): ListingThumbnail {
  const { pastPrices, ...thumbnail } = listing
  return thumbnail
}

type OperationsInfo = { insertedCount: number; updatedCount: number }
export type GetListingsThumbnail = (
  page: number,
  query?: string,
  brands?: string[],
  stores?: Store[]
) => Promise<{
  listingsThumbnail: ListingThumbnail[]
  totalPages: number
  nextPage: number
}>
export type GetListingById = (_id: string) => Promise<Listing>
export type GetListingsByIds = (ids: string[]) => Promise<Listing[]>
export type GetListingsForStore = (store: Store) => Promise<Listing[]>
export type PostListing = (listing: Listing) => Promise<Listing>
export type PutListing = (listing: Listing) => Promise<Listing>
export type PutListings = (listings: Listing[]) => Promise<OperationsInfo>
export type ListingIsValid = (listingId: string) => Promise<boolean>

export const markListingUnavailable = (listing: Listing): Listing => ({
  ...listing,
  unavailable: true,
})

export const updateListingDetails = (
  listing: Listing,
  newListing: Listing
): Listing => ({
  ...listing,
  brand: newListing.brand,
  image: newListing.image,
  name: newListing.name,
  unavailable: false,
})

export const updateListingLastUpdatedDate = (
  listing: Listing,
  date: Date
): Listing => ({
  ...listing,
  lastUpdatedDate: date,
})

export const updateListingPrice = (
  listing: Listing,
  newPrice: ListingPrice
): Listing => {
  const { price } = listing
  const priceHasChanged = price.value !== newPrice.value

  const updatedPrice: ListingPrice = priceHasChanged
    ? newPrice
    : {
        ...price,
        lastSeenDate: newPrice.setDate,
      }
  const updatedPastPrices = priceHasChanged
    ? [listing.price, ...listing.pastPrices]
    : listing.pastPrices

  delete (listing as any).lastRegularPriceSeen

  return {
    ...listing,
    price: updatedPrice,
    lastHigherPriceSeen: updatedPastPrices.find(
      ({ value }) => value > updatedPrice.value
    ),
    pastPrices: updatedPastPrices,
  }
}

export const findPriceAt = (listing: Listing, date: Date): ListingPrice => {
  const priceSetDate = new Date(listing.price.setDate)
  if (date.getTime() > priceSetDate.getTime()) return listing.price
  if (listing.pastPrices) {
    for (const price of listing.pastPrices) {
      const priceSetDate = new Date(price.setDate)
      if (date.getTime() > priceSetDate.getTime()) return price
    }
  }
}

export const sortListingsByComparisonPrice = (
  a: ListingThumbnail,
  b: ListingThumbnail
): number =>
  getComparisonPrice(a.price, a.size) - getComparisonPrice(b.price, b.size)

export const findCheapestListing = (listings: Listing[]): Listing =>
  listings.reduce(findCheapest)

export const findBestValueListing = (listings: Listing[]): Listing =>
  listings.reduce(findBestValue)

const findCheapest = (res: Listing, cur: Listing) =>
  getPrice(res) < getPrice(cur) ? res : cur

const findBestValue = (res: Listing, cur: Listing) =>
  getComparisonPrice(res.price, res.size) <
  getComparisonPrice(cur.price, cur.size)
    ? res
    : cur
