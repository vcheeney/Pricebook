import { ValidationError } from './errors'
import { ListingThumbnail } from './listing'
import { ListingSize } from './size'

export type Group = {
  _id: string
  userId: string
  name: string
  defaultComparisonSize: ListingSize
  createdAt: Date
  updatedAt: Date
  syncedAt: Date
  listingsThumbnail: ListingThumbnail[]
}

export const validateGroup = (group: Group) => {
  const errors = []

  if (!group._id) errors.push('Id is required')
  if (!group.userId) errors.push('User id is required')
  if (!group.name) errors.push('Name is required')
  if (!group.createdAt) errors.push('Creation date is required')
  if (!group.updatedAt) errors.push('Update date is required')
  if (!group.syncedAt) errors.push('Synced date is required')
  if (!group.listingsThumbnail) errors.push('Listing thumbnails are required')
  if (group.listingsThumbnail && group.listingsThumbnail.length === 0)
    errors.push('A group must contain listings')

  if (errors.length) throw new ValidationError(errors, { group })
}

export type GetAllGroups = () => Promise<Group[]>
export type GetUserGroups = (userId: string) => Promise<Group[]>
export type GetGroupById = (id: string) => Promise<Group>
export type PostGroup = (group: Group) => Promise<Group>
export type PutGroup = (group: Group) => Promise<Group>
export type DeleteGroupById = (id: string) => Promise<void>
