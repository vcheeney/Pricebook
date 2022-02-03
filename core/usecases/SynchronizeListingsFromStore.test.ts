import {
  updateListingLastUpdatedDate,
  updateListingDetails,
  updateListingPrice,
  markListingUnavailable,
  Store,
} from 'core/listing'
import { makeTestListing } from 'tests/utils'
import {
  SynchronizeListingsFromStorePort,
  synchronizeListingsFromStoreUseCase,
} from './SynchronizeListingsFromStore'

jest.mock('core/listing')

describe('SynchronizeListingsFromStore', () => {
  const listing1 = makeTestListing({ code: '1' })
  const listing1V2 = makeTestListing({ code: '1', name: 'v2' })
  const listing1V3 = makeTestListing({ code: '1', name: 'v3' })
  const listing2 = makeTestListing({ code: '2' })
  const listing2V2 = makeTestListing({ code: '2', name: 'v2' })
  const newP1 = makeTestListing({ code: '1', name: 'new' })
  const newP3 = makeTestListing({ code: '3', name: 'new' })
  const fetchedListings = [newP1, newP3]
  const storedListings = [listing1, listing2]
  const parsingFailures = [{ error: null, result: null }]

  const fetchFunction = jest.fn(async () => ({
    listings: fetchedListings,
    parsingFailures,
  }))

  beforeEach(() => {
    ;(<jest.Mock>updateListingLastUpdatedDate)
      .mockReturnValue(listing1)
      .mockReturnValueOnce(listing2)
  })
  ;(<jest.Mock>updateListingDetails).mockReturnValue(listing1V2)
  ;(<jest.Mock>updateListingPrice).mockReturnValue(listing1V3)
  ;(<jest.Mock>markListingUnavailable).mockReturnValue(listing2V2)

  const defaultPort: SynchronizeListingsFromStorePort = {
    synchronizationDate: new Date(),
    store: Store.maxi,
    getFetchFunction: jest.fn(() => fetchFunction),
    getListingsForStore: jest.fn(() => Promise.resolve(storedListings)),
    putListings: jest.fn(),
    respond: jest.fn(),
  }

  it('should get the fetch function for the store', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(defaultPort.getFetchFunction).toHaveBeenCalledWith(defaultPort.store)
  })

  it('should fetch the listings', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(fetchFunction).toHaveBeenCalled()
  })

  it('should get the store listings from the repository', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(defaultPort.getListingsForStore).toHaveBeenCalledWith(
      defaultPort.store
    )
  })

  it('should update the listing last updated date of the stored listings', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    storedListings.map((p) => {
      expect(updateListingLastUpdatedDate).toHaveBeenCalledWith(
        p,
        defaultPort.synchronizationDate
      )
    })
  })

  it('should update the listing details if the listing could be refetched', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(updateListingDetails).toHaveBeenCalledWith(listing1, newP1)
  })

  it('should update the listing price if the listing could be refetched', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(updateListingPrice).toHaveBeenCalledWith(listing1V2, newP1.price)
  })

  it('should mark listing unavailable if the listing could not be refetched', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(markListingUnavailable).toHaveBeenCalledWith(listing2)
  })

  it('should put the listings back in the repo', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(defaultPort.putListings).toHaveBeenCalledWith([
      newP3,
      listing1V3,
      listing2V2,
    ])
  })

  it('should respond with the parsing failures, the updated listings and the added listings', async () => {
    await synchronizeListingsFromStoreUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(
      parsingFailures,
      [listing2V2],
      [listing1V3],
      [newP3]
    )
  })
})
