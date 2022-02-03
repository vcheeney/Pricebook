import { Listing, GetListingById } from 'core/listing'

export type GetListingPort = {
  listingId: string
  getListingById: GetListingById
  respond: (listing: Listing) => void
}

export type GetListingUseCase = (port: GetListingPort) => Promise<void>

export const getListingUseCase: GetListingUseCase = async ({
  listingId,
  getListingById,
  respond,
}) => {
  const listing = await getListingById(listingId)
  respond(listing)
}
