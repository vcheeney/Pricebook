import { NextApiRequest, NextApiResponse } from 'next'
import { errorMiddleware } from 'lib/error-middleware'
import {
  deleteGroupById,
  getGroupById,
  getListingsByIds,
  putGroup,
} from 'lib/db'
import { createGroupUseCase } from 'core/usecases'
import { postGroup } from 'lib/db'
import { Group } from 'core/group'
import { getSession } from 'next-auth/client'
import { CustomError } from 'core/errors'
import { v4 as uuidv4 } from 'uuid'
import { updateGroupUseCase } from 'core/usecases/updateGroup'
import { deleteGroupUseCase } from 'core/usecases/DeleteGroup'

export default async (req: NextApiRequest, res: NextApiResponse<Group>) => {
  const session = await getSession({ req })
  if (!session) {
    throw new CustomError('The user is not authorized', { session })
  }
  const {
    query: { id: groupId },
  } = req

  if (req.method === 'GET') {
    try {
      const group = await getGroupById(groupId.toString())
      res.statusCode = 200
      res.json(group)
    } catch (error) {
      await errorMiddleware(error, res)
    }
  }

  if (req.method === 'POST') {
    try {
      const partialGroup: Partial<Group> = req.body
      await createGroupUseCase({
        partialGroup,
        id: uuidv4(),
        createdAt: new Date(),
        user: session.customUser,
        getListingsByIds,
        postGroup,
        respond: (group) => {
          res.statusCode = 200
          res.json(group)
        },
      })
    } catch (error) {
      await errorMiddleware(error, res)
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedGroup: Partial<Group> = req.body
      await updateGroupUseCase({
        groupId: groupId.toString(),
        updatedGroup,
        updatedAt: new Date(),
        user: session.customUser,
        getGroupById,
        getListingsByIds,
        putGroup,
        respond: (group) => {
          res.statusCode = 201
          res.json(group)
        },
      })
    } catch (error) {
      await errorMiddleware(error, res)
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteGroupUseCase({
        groupId: groupId.toString(),
        user: session.customUser,
        getGroupById,
        deleteGroupById,
        respond: () => {
          res.statusCode = 204
          res.json(null)
        },
      })
    } catch (error) {
      await errorMiddleware(error, res)
    }
  }
}
