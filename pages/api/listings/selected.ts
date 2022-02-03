import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import { getListingsByIds } from 'lib/db'
import { CustomError } from 'core/errors'
import { getSession } from 'next-auth/client'
import { getSelectedListingsUseCase } from 'core/usecases/GetSelectedListings'
import { Listing } from 'core/listing'

export default async (req: NextApiRequest, res: NextApiResponse<Listing[]>) => {
  try {
    const session = await getSession({ req })
    if (!session) {
      throw new CustomError('The user is not authorized', { session })
    }

    const { ids } = req.body
    await getSelectedListingsUseCase({
      ids,
      getListingsByIds,
      respond: (listings) => {
        res.statusCode = 200
        res.json(listings)
      },
    })
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
