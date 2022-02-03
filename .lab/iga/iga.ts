import { fetchIgaListings } from 'core/fetchers/fetchIgaListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const { listings, parsingFailures } = await fetchIgaListings(new Date())
  console.log(listings)
  storeInTmp('igaListings.json', listings)
}