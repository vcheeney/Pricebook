require('dotenv').config()
import { Store } from 'core/listing'
import { getListingsForStore, putListings } from 'lib/db'

run()

async function run() {
  console.time('all')
  const listings = await getListingsForStore(Store.maxi)
  console.log(listings)
  console.timeEnd('all')

  console.time('upsert')
  const res = await putListings(
    listings.map((p) => ({ ...p, _id: p._id + 'ALLO2', test: true }))
  )
  console.timeEnd('upsert')
  console.log('done')
  console.log(res)
}
