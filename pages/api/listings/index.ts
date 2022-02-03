import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { errorMiddleware } from 'lib/error-middleware'
import { getListingsThumbnailUseCase } from 'core/usecases'
import { getListingsThumbnail } from 'lib/db'
import { ListingThumbnail } from 'core/listing'
import { CustomError } from 'core/errors'

export type GetListingsResponse = {
  count: number
  totalPages: number
  searchParams: {
    query: string
    page: number
  }
  listingsThumbnail: ListingThumbnail[]
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GetListingsResponse>
) => {
  try {
    const session = await getSession({ req })
    if (!session) {
      throw new CustomError('The user is not authorized', { session })
    }

    const { page, query, brands, stores } = req.body
    await getListingsThumbnailUseCase({
      page,
      query,
      brands,
      stores,
      getListingsThumbnail,
      respond: (
        listingsThumbnail: ListingThumbnail[],
        totalPages: number,
        nextPage: number
      ) => {
        res.statusCode = 200
        res.json({
          count: listingsThumbnail.length,
          totalPages,
          searchParams: {
            query,
            page: nextPage,
          },
          listingsThumbnail,
        })
      },
    })
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
