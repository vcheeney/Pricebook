import { Store } from 'core/listing'
import { getListingsForStore } from 'lib/db'
import { storeInTmp } from 'lib/tmp'

require('dotenv').config()

run()

async function run() {
  const listings1 = await getListingsForStore(Store.maxi)
  const listings2 = await getListingsForStore(Store.provigo)
  const listings3 = await getListingsForStore(Store.iga)

  const brands = [...listings1, ...listings2, ...listings3].reduce<string[]>(
    (res, cur) => {
      if (!res.includes(cur.brand) && cur.brand) return [...res, cur.brand]
      return res
    },
    []
  )

  storeInTmp('brands.json', brands.sort())
}
