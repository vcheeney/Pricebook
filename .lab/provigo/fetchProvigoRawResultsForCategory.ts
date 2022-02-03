import { removeDuplicates } from 'core/fetchers/common'
import { fetchProvigoRawResultsForCategory } from 'core/fetchers/fetchProvigoListings'
import { storeInTmp } from 'lib/tmp'

run()

async function run() {
  const results = await fetchProvigoRawResultsForCategory(
    new Date(),
    'PVG001008000000'
  )
  const rmDup = removeDuplicates(results)
  const sorted = rmDup.sort((a, b) => {
    const aName = `${a.brand ? `${a.brand}, ` : ''}${a.name}`
    const bName = `${b.brand ? `${b.brand}, ` : ''}${b.name}`
    return aName > bName ? 1 : bName > aName ? -1 : 0
  })
  storeInTmp('PVG001008000000.json', sorted)
}
