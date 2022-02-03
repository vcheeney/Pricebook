import { Result } from 'core/fetchers/common.types'
import { makeListingsFromMaxiRawResults } from 'core/fetchers/fetchMaxiListings'
import { listing } from 'core/listing'
import { storeInTmp } from 'lib/tmp'
import { isEqual } from 'lodash'

run()

async function run() {
  const fetchedDate = new Date(0, 0, 0)

  const results: Result[] = require('./maxiResults.json')
  const expectedListings: listing[] = require('./maxiListings.json')
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

  const { listings } = makeListingsFromMaxiRawResults(results, fetchedDate)

  const nonEqualListings = listings.reduce((res, cur, i) => {
    const expected = { ...expectedListingsParsed[i], unstable: undefined }
    if (!isEqual(cur, expected)) {
      if (
        isEqual({ ...cur, price: null }, { ...expected, price: null }) &&
        cur.price.isSale === expected.price.isSale &&
        Math.abs(cur.price.value - expected.price.value) > 1
      )
        return res.concat({ old: expected, new: cur })
    }
    return res
  }, [])
  storeInTmp('nonEqualListingsMaxi.json', nonEqualListings)
}
