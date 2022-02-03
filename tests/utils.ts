import { LogError } from 'core/errors'
import { Group } from 'core/group'
import { ListingPrice } from 'core/price'
import { Listing, ListingThumbnail, Store } from 'core/listing'
const { makeListing } = jest.requireActual('core/listing')
import { ListingSize, Per100g, Units } from 'core/size'
import { User } from 'core/user'

const defaultDate = new Date(0)

const defaultTestUser: User = {
  _id: 'abc',
  createdAt: defaultDate,
  updatedAt: defaultDate,
  email: 'abc@email.com',
  image: 'wwww.image.com',
  name: 'Abc Def',
  approved: true,
}

export function makeTestUser(partial?: Partial<User>): User {
  return {
    ...defaultTestUser,
    ...partial,
  }
}

const defaultTestPrice: ListingPrice = {
  lastSeenDate: defaultDate,
  setDate: defaultDate,
  value: 1,
  isSale: false,
}

export function makeTestPrice(partial?: Partial<ListingPrice>): ListingPrice {
  return {
    ...defaultTestPrice,
    ...partial,
  }
}

const defaultTestListingSize: ListingSize = {
  quantity: 1,
  unit: Units.g,
  value: 100,
}

export function makeTestSize(partial?: Partial<ListingSize>): ListingSize {
  return {
    ...defaultTestListingSize,
    ...partial,
  }
}

const defaultTestListing: Listing = {
  _id: 'id',
  addedDate: defaultDate,
  lastUpdatedDate: defaultDate,
  code: 'code',
  store: Store.maxi,
  brand: 'brand',
  name: 'name',
  price: makeTestPrice(),
  lastHigherPriceSeen: makeTestPrice({ isSale: false }),
  size: makeTestSize(),
  image: 'image',
  link: 'link',
  pastPrices: [],
}

export function makeTestListing(partial?: Partial<Listing>): Listing {
  return makeListing({
    ...defaultTestListing,
    ...partial,
  })
}

export function makeTestListingThumbnail(
  partial?: Partial<ListingThumbnail>
): ListingThumbnail {
  const { pastPrices, ...thumbnail } = makeTestListing(partial)
  return thumbnail
}

const defaultTestGroup: Group = {
  _id: 'id',
  userId: 'userId',
  defaultComparisonSize: Per100g,
  createdAt: defaultDate,
  updatedAt: defaultDate,
  syncedAt: defaultDate,
  name: 'name',
  listingsThumbnail: [makeTestListingThumbnail()],
}

export function makeTestGroup(partial?: Partial<Group>): Group {
  return {
    ...defaultTestGroup,
    ...partial,
  }
}

export function makeTestLogger(): LogError {
  return (error) => Promise.resolve()
}
