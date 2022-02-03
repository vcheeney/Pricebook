import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import { getUserGroups } from 'lib/db'
import { CustomError } from 'core/errors'
import { getSession } from 'next-auth/client'
import { Group } from 'core/group'

export default async (req: NextApiRequest, res: NextApiResponse<Group[]>) => {
  const session = await getSession({ req })
  if (!session) {
    throw new CustomError('The user is not authorized', { session })
  }

  try {
    const groups = await getUserGroups(session.customUser._id)
    res.statusCode = 200
    res.json(groups)
  } catch (error) {
    await errorMiddleware(error, res)
  }
}
