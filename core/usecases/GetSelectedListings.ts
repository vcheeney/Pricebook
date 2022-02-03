import { Listing, GetListingById, GetListingsByIds } from 'core/listing'

export type GetSelectedListingsPort = {
  ids: string[]
  getListingsByIds: GetListingsByIds
  respond: (listings: Listing[]) => void
}

export type GetSelectedListingsUseCase = (
  port: GetSelectedListingsPort
) => Promise<void>

export const getSelectedListingsUseCase: GetSelectedListingsUseCase = async ({
  ids,
  getListingsByIds,
  respond,
}) => {
  const listings = await getListingsByIds(ids)
  respond(listings)
}
