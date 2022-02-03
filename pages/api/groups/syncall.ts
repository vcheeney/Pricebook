import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import { syncAllGroupsUseCase } from 'core/usecases/SyncAllGroups'
import { getAllGroups, getGroupById, putGroup, getListingsByIds } from 'lib/db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const syncedAt = new Date()
    await syncAllGroupsUseCase({
      syncedAt,
      getAllGroups,
      syncGroupPortGeneral: {
        getGroupById,
        getListingsByIds,
        putGroup,
        respond: (group) => {},
      },
      logError: console.error,
    })
    res.statusCode = 200
    res.json({ success: true })
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
