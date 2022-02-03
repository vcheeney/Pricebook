import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import { syncGroupUseCase } from 'core/usecases/SyncGroup'
import { getGroupById, putGroup } from 'lib/db'
import { getListingsByIds } from 'lib/db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body
    const syncedAt = new Date()
    await syncGroupUseCase({
      groupId: id,
      syncedAt,
      getGroupById,
      getListingsByIds,
      putGroup,
      respond: (group) => {
        res.statusCode = 200
        res.json(group)
      },
    })
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
