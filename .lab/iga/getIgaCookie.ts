import { getIgaCookie, fetchPageResults } from 'core/fetchers/fetchIgaListings'
import { clearTmpDir } from 'lib/tmp'

run()

async function run() {
  clearTmpDir('iga')
  const cookie = await getIgaCookie()
  const pageRes = await fetchPageResults(1, 50, new Date(), cookie)
  console.log(pageRes)
}
