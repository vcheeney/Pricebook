import { fetchAllProvigoRawResults } from 'core/fetchers/fetchProvigoListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchAllProvigoRawResults(new Date())
  const packageSizes = results.reduce(
    (acc, cur) =>
      acc.includes(cur.packageSize) ? acc : [...acc, cur.packageSize],
    []
  )
  storeInTmp('provigoPackageSizes.json', packageSizes)
}
