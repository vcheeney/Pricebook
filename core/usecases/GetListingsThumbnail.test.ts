import { makeTestListing } from 'tests/utils'
import {
  GetListingsThumbnailPort,
  getListingsThumbnailUseCase,
} from './GetListingsThumbnail'

describe('GetListingsThumbnail', () => {
  const listing1 = makeTestListing()
  const listing2 = makeTestListing()
  const listingsThumbnail = [listing1, listing2]

  const defaultPort: GetListingsThumbnailPort = {
    page: 0,
    getListingsThumbnail: jest.fn(() =>
      Promise.resolve({ listingsThumbnail, totalPages: 1, nextPage: null })
    ),
    respond: jest.fn(),
  }

  it('should get all listings thumbnail', async () => {
    await getListingsThumbnailUseCase(defaultPort)
    expect(defaultPort.getListingsThumbnail).toHaveBeenCalled()
  })

  it('should respond with the received listings thumbnail', async () => {
    await getListingsThumbnailUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(listingsThumbnail, 1, null)
  })
})
