import { fetchAllIgaRawResults } from 'core/fetchers/fetchIgaListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchAllIgaRawResults(new Date())
  const packageSizes = results.reduce(
    (res, cur) => (res.includes(cur.Size) ? res : res.concat(cur.Size)),
    []
  )
  storeInTmp('igaPackageSizes.json', packageSizes)
}
