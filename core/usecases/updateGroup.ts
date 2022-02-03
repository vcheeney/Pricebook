import { CustomError } from 'core/errors'
import { GetGroupById, Group, PutGroup, validateGroup } from 'core/group'
import {
  GetListingsByIds,
  makeListingThumbnail,
  sortListingsByComparisonPrice,
} from 'core/listing'
import { User } from 'core/user'

export type UpdateGroupPort = {
  groupId: string
  updatedGroup: Partial<Group>
  updatedAt: Date
  user: User
  getGroupById: GetGroupById
  getListingsByIds: GetListingsByIds
  putGroup: PutGroup
  respond: (group: Group) => void
}

export type UpdateGroupUseCase = (port: UpdateGroupPort) => Promise<void>

export const updateGroupUseCase: UpdateGroupUseCase = async ({
  groupId,
  updatedGroup,
  updatedAt,
  user,
  getGroupById,
  getListingsByIds,
  putGroup,
  respond,
}) => {
  const group = await getGroupById(groupId)

  if (group.userId !== user._id)
    throw new CustomError('User cannot update a group that he does not own', {
      group,
    })

  const newGroup: Group = {
    ...group,
    updatedAt: updatedAt,
    name: updatedGroup.name,
  } as Group
  validateGroup(newGroup)

  const listingIds = updatedGroup.listingsThumbnail.map((l) => l._id)
  const listings = await getListingsByIds(listingIds)

  const groupV2: Group = {
    ...newGroup,
    listingsThumbnail: listings
      .sort(sortListingsByComparisonPrice)
      .map(makeListingThumbnail),
  }

  validateGroup(groupV2)
  await putGroup(groupV2)
  respond(groupV2)
}
