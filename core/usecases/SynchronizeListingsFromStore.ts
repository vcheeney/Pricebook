import { GetFetchFunction, ParsingFailure } from 'core/fetchFunction'
import {
  Store,
  GetListingsForStore,
  PutListings,
  Listing,
  updateListingLastUpdatedDate,
  updateListingDetails,
  updateListingPrice,
  markListingUnavailable,
} from 'core/listing'

export type SynchronizeListingsFromStorePort = {
  synchronizationDate: Date
  store: Store
  getFetchFunction: GetFetchFunction
  getListingsForStore: GetListingsForStore
  putListings: PutListings
  respond: (
    parsingFailures: ParsingFailure[],
    updatedUnvailableListings: Listing[],
    updatedAvailableListings: Listing[],
    addedListings: Listing[]
  ) => void
}

export type SynchronizeListingsFromStoreUseCase = (
  port: SynchronizeListingsFromStorePort
) => Promise<void>

export const synchronizeListingsFromStoreUseCase: SynchronizeListingsFromStoreUseCase = async ({
  synchronizationDate: syncDate,
  store,
  getFetchFunction,
  getListingsForStore,
  putListings,
  respond,
}) => {
  const fetch = getFetchFunction(store)
  const { listings, parsingFailures } = await fetch(syncDate, false)

  const storedListings = (await getListingsForStore(store)).map((listing) =>
    updateListingLastUpdatedDate(listing, syncDate)
  )

  const { updatedListings, addedListings } = listings.reduce(
    (res, cur) => {
      const storedListing = storedListings.find((p) => p._id === cur._id)
      if (storedListing) {
        const listingV2 = updateListingDetails(storedListing, cur)
        const listingV3 = updateListingPrice(listingV2, cur.price)
        return { ...res, updatedListings: [...res.updatedListings, listingV3] }
      }
      return { ...res, addedListings: [...res.addedListings, cur] }
    },
    { updatedListings: [], addedListings: [] }
  )

  const updatedUnvailableListings = storedListings
    .filter((sp) => !listings.find((p) => p._id === sp._id))
    .map((up) => markListingUnavailable(up))

  await putListings([
    ...addedListings,
    ...updatedListings,
    ...updatedUnvailableListings,
  ])

  respond(
    parsingFailures,
    updatedUnvailableListings,
    updatedListings,
    addedListings
  )
}
