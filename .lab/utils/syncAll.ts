require('dotenv').config()
import { Store } from 'core/listing'
import { synchronizeListingsFromStoreUseCase } from 'core/usecases/SynchronizeListingsFromStore'
import { storeInTmp } from 'lib/tmp'
import { putListings, getListingsForStore } from 'lib/db'
import { getFetchFunction } from 'core/fetchers/GetFetchFunction'
import { format } from 'date-fns'

run()

async function run() {
  const today = new Date()

  console.time('sync')
  console.log(`Started at ${today.toLocaleString()}`)
  console.log('Synchronizing Maxi listings...')
  console.log('Synchronizing Provigo listings...')
  console.log('Synchronizing IGA listings...')

  await Promise.all(
    [Store.maxi, Store.provigo].map((store) =>
      synchronizeListingsFromStoreUseCase({
        store,
        synchronizationDate: today,
        getFetchFunction,
        getListingsForStore,
        putListings,
        respond: (fails, down, updated, added) => {
          console.log(`The ${store} synchronization finished. There was:`)
          console.log(`👉 ${fails.length} parsing failures`)
          console.log(`🤞 ${down.length} listings marked unavailable`)
          console.log(`👍 ${updated.length} listings updated`)
          console.log(`🙌 ${added.length} listings added`)
          const basePath = `sync/${format(today, 'yyyyMMdd')}/${store}`
          storeInTmp(`${basePath}/parsingFailure.json`, fails)
          storeInTmp(`${basePath}/unavailableListings.json`, down)
          storeInTmp(`${basePath}/updatedListings.json`, updated)
          storeInTmp(`${basePath}/addedListings.json`, added)
        },
      })
    )
  )

  await Promise.all(
    [Store.iga].map((store) =>
      synchronizeListingsFromStoreUseCase({
        store,
        synchronizationDate: today,
        getFetchFunction,
        getListingsForStore,
        putListings,
        respond: (fails, down, updated, added) => {
          console.log(`The ${store} synchronization finished. There was:`)
          console.log(`👉 ${fails.length} parsing failures`)
          console.log(`🤞 ${down.length} listings marked unavailable`)
          console.log(`👍 ${updated.length} listings updated`)
          console.log(`🙌 ${added.length} listings added`)
          const basePath = `sync/${format(today, 'yyyyMMdd')}/${store}`
          storeInTmp(`${basePath}/parsingFailure.json`, fails)
          storeInTmp(`${basePath}/unavailableListings.json`, down)
          storeInTmp(`${basePath}/updatedListings.json`, updated)
          storeInTmp(`${basePath}/addedListings.json`, added)
        },
      })
    )
  )

  console.timeEnd('sync')
}
