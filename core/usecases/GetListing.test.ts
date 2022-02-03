import { makeTestListing } from 'tests/utils'
import { GetListingPort, getListingUseCase } from './GetListing'

describe('GetListing', () => {
  const listingId = 'id'
  const listing = makeTestListing({ _id: listingId })

  const defaultPort: GetListingPort = {
    listingId,
    getListingById: jest.fn(() => Promise.resolve(listing)),
    respond: jest.fn(),
  }

  it('should get listing by id', async () => {
    await getListingUseCase(defaultPort)
    expect(defaultPort.getListingById).toHaveBeenCalledWith(listingId)
  })

  it('should respond with the received listing', async () => {
    await getListingUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(listing)
  })
})
