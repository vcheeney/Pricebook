import { fetchMaxiListings } from 'core/fetchers/fetchMaxiListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const { listings, parsingFailures } = await fetchMaxiListings(new Date())
  storeInTmp('maxiListings.json', listings)
}
