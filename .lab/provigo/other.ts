import { Result } from 'core/fetchers/common.types'
import { makeListingsFromProvigoRawResults } from 'core/fetchers/fetchProvigoListings'
import { listing } from 'core/listing'
import { isEqual } from 'lodash'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const fetchedDate = new Date(0, 0, 0)

  const results: Result[] = require('./provigoResults.json')
  const expectedListings: listing[] = require('./provigoListings.json')
  const expectedListingsParsed: listing[] = expectedListings.map((p) => ({
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

  const nonEqualListings = listings.reduce((res, cur, i) => {
    const expected = { ...expectedListingsParsed[i], unstable: undefined }
    if (!isEqual(cur, expected)) {
      // if (
      //   isEqual({ ...cur, price: null }, { ...expected, price: null }) &&
      //   cur.price.isSale === expected.price.isSale &&
      //   Math.abs(cur.price.value - expected.price.value) > 1
      // )
      if (!isEqual({ ...cur, price: null }, { ...expected, price: null }))
        return res.concat({ old: expected, new: cur })
    }
    return res
  }, [])
  console.log(nonEqualListings)
  storeInTmp('nonEqualProvigoListingsOther.json', nonEqualListings)
}
