import { makeTestListing } from 'tests/utils'
import {
  GetSelectedListingsPort,
  getSelectedListingsUseCase,
} from './GetSelectedListings'

describe('getSelectedListings', () => {
  const ids = ['a']
  const listings = [makeTestListing()]
  const defaultPort: GetSelectedListingsPort = {
    ids,
    getListingsByIds: jest.fn(() => Promise.resolve(listings)),
    respond: jest.fn(),
  }

  it('should get the listings by ids', async () => {
    await getSelectedListingsUseCase(defaultPort)
    expect(defaultPort.getListingsByIds).toHaveBeenCalledWith(ids)
  })

  it('should respond with the listings', async () => {
    await getSelectedListingsUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(listings)
  })
})
