import { CustomError } from 'core/errors'
import { DeleteGroupById, GetGroupById } from 'core/group'
import { User } from 'core/user'

export type DeleteGroupPort = {
  groupId: string
  user: User
  getGroupById: GetGroupById
  deleteGroupById: DeleteGroupById
  respond: () => void
}

export type DeleteGroupUseCase = (port: DeleteGroupPort) => Promise<void>

export const deleteGroupUseCase: DeleteGroupUseCase = async ({
  groupId,
  user,
  getGroupById,
  deleteGroupById,
  respond,
}) => {
  const group = await getGroupById(groupId)

  if (group.userId !== user._id)
    throw new CustomError('User cannot delete a group that he does not own', {
      group,
    })

  await deleteGroupById(groupId)
  respond()
}
