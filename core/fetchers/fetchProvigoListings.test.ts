import { Store, Listing } from 'core/listing'
import { Result } from './common.types'
import {
  makeListingFromProvigoRawResult,
  makeListingsFromProvigoRawResults,
} from './fetchProvigoListings'

describe('makeListingFromProvigoRawResult', () => {
  test('should make listing properly', () => {
    const fetchedDate = new Date(0, 0, 0)

    const result: Result = require('./tests/provigoResults.json')[0]
    const listing = makeListingFromProvigoRawResult(result, fetchedDate)

    expect(listing.addedDate).toBe(fetchedDate)
    expect(listing.lastUpdatedDate).toBe(fetchedDate)
    expect(listing).toBeDefined()
    expect(listing.code).toBe(result.code)
    expect(listing.store).toBe(Store.provigo)
    expect(listing.brand).toBe(result.brand)
    expect(listing.name).toBe(result.name)
    expect(listing.image).toBe(result.imageAssets[0].smallUrl)
    expect(listing.link).toBe(`https://www.provigo.ca${result.link}`)
  })
})

describe('makeListingsFromMaxiRawResults', () => {
  test('Regression Test (9000+ listings)', () => {
    const fetchedDate = new Date(0, 0, 0)

    const results: Result[] = require('./tests/provigoResults.json')
    const expectedListings: Listing[] = require('./tests/provigoListings.json')
    const expectedListingsParsed: Listing[] = expectedListings.map((p) => ({
      ...p,
      addedDate: new Date(fetchedDate),
      lastUpdatedDate: new Date(fetchedDate),
      price: {
        ...p.price,
        lastSeenDate: new Date(fetchedDate),
        setDate: new Date(fetchedDate),
      },
    }))

    const { listings } = makeListingsFromProvigoRawResults(results, fetchedDate)

    listings.forEach((listing, i) => {
      expect(listing).toEqual(expectedListingsParsed[i])
    })
  })
})
