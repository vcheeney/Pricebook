import { makeTestListing, makeTestPrice, makeTestSize } from 'tests/utils'
import {
  makeListing,
  markListingUnavailable,
  updateListingDetails,
  updateListingLastUpdatedDate,
  updateListingPrice,
} from './listing'

describe('makeListing', () => {
  it('should throw if field are missing', () => {
    expect(() => makeListing({ code: 'allo' })).toThrowError()
  })

  it('should return valid listing if all fields are passed properly', () => {
    const partial = makeTestListing({
      price: makeTestPrice(),
      size: makeTestSize(),
    })
    const listing = makeListing(partial)

    expect(listing).toEqual(partial)
  })
})

describe('markListingUnavailable', () => {
  const listing = makeTestListing()

  it('should mark the listing unavailable', () => {
    const res = markListingUnavailable(listing)
    expect(res.unavailable).toBe(true)
  })
})

describe('updateListingDetails', () => {
  const listing = makeTestListing({
    brand: 'brand1',
    image: 'image1',
    name: 'name1',
  })
  const newListing = makeTestListing({
    brand: 'brand2',
    image: 'image2',
    name: 'name2',
  })

  it('should update the listing brand', () => {
    const res = updateListingDetails(listing, newListing)
    expect(res.brand).toBe(newListing.brand)
  })

  it('should update the listing image', () => {
    const res = updateListingDetails(listing, newListing)
    expect(res.image).toBe(newListing.image)
  })

  it('should update the listing name', () => {
    const res = updateListingDetails(listing, newListing)
    expect(res.name).toBe(newListing.name)
  })

  it('should update the listing to be available again', () => {
    const res = updateListingDetails(listing, newListing)
    expect(res.unavailable).toBe(false)
  })
})

describe('updateListingLastUpdatedDate', () => {
  const listing = makeTestListing()

  it('should set the last updated date to the passed date', () => {
    const newDate = new Date(1)
    const res = updateListingLastUpdatedDate(listing, newDate)
    expect(res.lastUpdatedDate).toBe(newDate)
  })
})

describe('updateListingPrice', () => {
  describe('price has not changed', () => {
    const listing = makeTestListing({
      price: makeTestPrice({ lastSeenDate: new Date(0) }),
    })
    const newPrice = makeTestPrice({ setDate: new Date(1) })

    it('should update the listing price last seen date', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.price.lastSeenDate).toBe(newPrice.setDate)
    })

    it('should not update the past prices array', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.pastPrices).toBe(listing.pastPrices)
      expect(res.pastPrices).toHaveLength(0)
    })

    it('should not find a last regular price seen', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.lastHigherPriceSeen).toBeUndefined()
    })
  })

  describe('price has changed', () => {
    const listing = makeTestListing({
      price: makeTestPrice(),
      pastPrices: [makeTestPrice()],
    })
    const newPrice = makeTestPrice({
      setDate: new Date(1),
      lastSeenDate: new Date(1),
      value: 0.5,
    })

    it('should set the listing price to the new price', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.price).toBe(newPrice)
    })

    it('should unshift the current price in the past prices array', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.pastPrices[0]).toBe(listing.price)
    })

    it('should find a last higher price seen', () => {
      const res = updateListingPrice(listing, newPrice)
      expect(res.lastHigherPriceSeen).toBe(listing.price)
    })
  })
})

describe('findPriceAt', () => {})
