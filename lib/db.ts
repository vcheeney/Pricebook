import { CustomError, LogError } from 'core/errors'
import {
  DeleteGroupById,
  GetAllGroups,
  GetGroupById,
  GetUserGroups,
  Group,
  PostGroup,
  PutGroup,
} from 'core/group'
import {
  GetListingById,
  GetListingsByIds,
  GetListingsForStore,
  PostListing,
  Listing,
  ListingIsValid,
  PutListing,
  PutListings,
} from 'core/listing'
import { connectToDatabase } from './mongodb'
import { GetListingsThumbnail } from 'core/listing'
import { FilterQuery, FindOneOptions, Cursor } from 'mongodb'
import { GetUserByEmail, GetUserById, User } from 'core/user'

export enum Collection {
  LISTINGS = 'listings',
  GROUPS = 'groups',
  ERRORS = 'errors',
  SESSIONS = 'sessions',
  USERS = 'users',
}

export type SearchParams = {
  page: number
  query: string
}

export const postError: LogError = async (error) => {
  const { db } = await connectToDatabase()
  const errorsCollection = db.collection(Collection.ERRORS)
  const errorDocument = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context: error.context,
    date: error.date,
  }
  await errorsCollection.insertOne(errorDocument)
}

const pageSize = 20

export const getListingsThumbnail: GetListingsThumbnail = async (
  page,
  query,
  brands,
  stores
) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection<Listing>(Collection.LISTINGS)

  const filter: FilterQuery<Listing> = {}
  if (query) filter.$text = { $search: query }
  if (brands && brands.length) filter.brand = { $in: brands }
  if (stores && stores.length) filter.store = { $in: stores }

  const options: FindOneOptions<Listing> = {
    projection: {
      pastPrices: false,
    },
  }

  let cursor = listingsCollection.find(filter, options)

  const totalPages = await countPages(cursor)
  const nextPage = await getNextPageNumber(totalPages, page)
  const listingsThumbnail = await getPaginatedResults(cursor, page)

  return { listingsThumbnail, totalPages, nextPage }
}

const countPages = async (cursor: Cursor) =>
  Math.ceil((await cursor.count()) / pageSize)

const getNextPageNumber = async (totalPages: number, page: number) => {
  if (++page < totalPages) return page
  return null
}

const getPaginatedResults = async (cursor: Cursor, page: number) =>
  await cursor
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray()

export const getListingById: GetListingById = async (_id) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  const listing = await listingsCollection.findOne({ _id })
  if (!listing) throw new CustomError('No listing have this id', { _id })
  return listing
}

export const putListings: PutListings = async (listings) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  const res = await listingsCollection.bulkWrite(
    listings.map((listing) => ({
      replaceOne: {
        filter: { _id: listing._id },
        replacement: listing,
        upsert: true,
      },
    })),
    {
      ordered: false,
    }
  )
  return { insertedCount: res.upsertedCount, updatedCount: res.modifiedCount }
}

export const putListing: PutListing = async (listing) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  await listingsCollection.replaceOne({ _id: listing._id }, listing)
  return listing
}

export const listingIsValid: ListingIsValid = async (listingId) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  const storedListing: Listing = await listingsCollection.findOne({
    _id: listingId,
  })
  return !!storedListing
}

export const postListing: PostListing = async (listing) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  await listingsCollection.insertOne(listing)
  return listing
}

export const getListingsForStore: GetListingsForStore = async (store) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  const cursor = listingsCollection.find({ store })
  const listings = await cursor.toArray()
  return listings
}

export const getListingsByIds: GetListingsByIds = async (ids: string[]) => {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection(Collection.LISTINGS)
  const listings = await listingsCollection
    .find({
      _id: { $in: ids },
    })
    .toArray()
  return listings
}

export const getAllGroups: GetAllGroups = async () => {
  const { db } = await connectToDatabase()
  const groupsCollection = db.collection(Collection.GROUPS)
  return await groupsCollection.find().toArray()
}

export const getGroupById: GetGroupById = async (_id) => {
  const { db } = await connectToDatabase()
  const groupsCollection = db.collection(Collection.GROUPS)
  const group: Group = await groupsCollection.findOne({ _id })
  if (!group) throw new CustomError('No group have this id', { _id })
  return group
}

export const postGroup: PostGroup = async (group) => {
  const { db } = await connectToDatabase()
  const collection = db.collection(Collection.GROUPS)
  await collection.insertOne(group)
  return group
}

export const putGroup: PutGroup = async (group) => {
  const { db } = await connectToDatabase()
  const groupsCollection = db.collection(Collection.GROUPS)
  await groupsCollection.replaceOne({ _id: group._id }, group)
  return group
}

export const deleteGroupById: DeleteGroupById = async (id) => {
  const { db } = await connectToDatabase()
  const groupsCollection = db.collection(Collection.GROUPS)
  await groupsCollection.deleteOne({ _id: id })
}

export const getUserById: GetUserById = async (id) => {
  const { db } = await connectToDatabase()
  const usersCollection = db.collection<User>(Collection.USERS)
  return await usersCollection.findOne({ _id: id })
}

export const getUserByEmail: GetUserByEmail = async (email) => {
  const { db } = await connectToDatabase()
  const usersCollection = db.collection<User>(Collection.USERS)
  return await usersCollection.findOne({ email: email })
}

export const getUserGroups: GetUserGroups = async (userId) => {
  const { db } = await connectToDatabase()
  const groupsCollection = db.collection<Group>(Collection.GROUPS)
  return await groupsCollection.find({ userId }).toArray()
}
