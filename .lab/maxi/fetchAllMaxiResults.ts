import { fetchAllMaxiRawResults } from 'core/fetchers/fetchMaxiListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchAllMaxiRawResults(new Date())
  storeInTmp('maxiResults.json', results)
}
