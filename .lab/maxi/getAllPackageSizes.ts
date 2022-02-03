import { fetchAllMaxiRawResults } from 'core/fetchers/fetchMaxiListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchAllMaxiRawResults(new Date())
  const packageSizes = results.reduce(
    (acc, cur) =>
      acc.includes(cur.packageSize) ? acc : [...acc, cur.packageSize],
    []
  )
  storeInTmp('maxiPackageSizes.json', packageSizes)
}
