import { fetchAllProvigoRawResults } from 'core/fetchers/fetchProvigoListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchAllProvigoRawResults(new Date())
  storeInTmp('provigoResults.json', results)
}
