import { GetGroupById, PutGroup, Group, validateGroup } from 'core/group'
import {
  GetListingsByIds,
  makeListingThumbnail,
  sortListingsByComparisonPrice,
} from 'core/listing'

export type SyncGroupPort = {
  groupId: string
  syncedAt: Date
  getGroupById: GetGroupById
  getListingsByIds: GetListingsByIds
  putGroup: PutGroup
  respond: (group: Group) => void
}

export type SyncGroupUseCase = (port: SyncGroupPort) => Promise<void>

export const syncGroupUseCase: SyncGroupUseCase = async ({
  groupId,
  syncedAt,
  getGroupById,
  getListingsByIds,
  putGroup,
  respond,
}) => {
  const group = await getGroupById(groupId)
  const groupV2: Group = { ...group, syncedAt: syncedAt }
  validateGroup(groupV2)

  const listingIds = groupV2.listingsThumbnail.map((l) => l._id)
  const listings = await getListingsByIds(listingIds)

  const groupV3: Group = {
    ...groupV2,
    listingsThumbnail: listings
      .sort(sortListingsByComparisonPrice)
      .map(makeListingThumbnail),
  }

  validateGroup(groupV3)
  await putGroup(groupV3)
  respond(groupV3)
}
