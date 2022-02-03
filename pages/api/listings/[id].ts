import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import { getListingUseCase } from 'core/usecases'
import { getListingById } from 'lib/db'
import { CustomError } from 'core/errors'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })
    if (!session) {
      throw new CustomError('The user is not authorized', { session })
    }

    const {
      query: { id: listingId },
    } = req
    await getListingUseCase({
      listingId: listingId.toString(),
      getListingById,
      respond: (listing) => {
        res.statusCode = 200
        res.json(listing)
      },
    })
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
