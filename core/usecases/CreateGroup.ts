import { CustomError } from 'core/errors'
import { Group, PostGroup, validateGroup } from 'core/group'
import {
  GetListingsByIds,
  makeListingThumbnail,
  sortListingsByComparisonPrice,
} from 'core/listing'
import { User } from 'core/user'

export type CreateGroupPort = {
  partialGroup: Partial<Group>
  id: string
  createdAt: Date
  user: User
  getListingsByIds: GetListingsByIds
  postGroup: PostGroup
  respond: (group: Group) => void
}

export type CreateGroupUseCase = (port: CreateGroupPort) => Promise<void>

export const createGroupUseCase: CreateGroupUseCase = async ({
  partialGroup,
  id,
  createdAt,
  user,
  getListingsByIds,
  postGroup,
  respond,
}) => {
  const newGroup: Group = {
    ...partialGroup,
    _id: id,
    userId: user._id,
    createdAt: createdAt,
    updatedAt: createdAt,
    syncedAt: createdAt,
  } as Group
  validateGroup(newGroup)

  const listingIds = partialGroup.listingsThumbnail.map((l) => l._id)
  const listings = await getListingsByIds(listingIds)

  const groupV2: Group = {
    ...newGroup,
    listingsThumbnail: listings
      .sort(sortListingsByComparisonPrice)
      .map(makeListingThumbnail),
  }

  validateGroup(groupV2)
  await postGroup(groupV2)
  respond(groupV2)
}
