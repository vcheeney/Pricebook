import { Store, GetListingsThumbnail, ListingThumbnail } from 'core/listing'

export type GetListingsThumbnailPort = {
  page: number
  query?: string
  brands?: string[]
  stores?: Store[]
  getListingsThumbnail: GetListingsThumbnail
  respond: (
    ListingThumbnail: ListingThumbnail[],
    totalPages: number,
    nextPage: number
  ) => void
}

export type GetListingsThumbnailUseCase = (
  port: GetListingsThumbnailPort
) => Promise<void>

export const getListingsThumbnailUseCase: GetListingsThumbnailUseCase = async ({
  page,
  query,
  brands,
  stores,
  getListingsThumbnail,
  respond,
}) => {
  const {
    listingsThumbnail,
    totalPages,
    nextPage,
  } = await getListingsThumbnail(page, query, brands, stores)
  respond(listingsThumbnail, totalPages, nextPage)
}
