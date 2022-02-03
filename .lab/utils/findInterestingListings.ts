require('dotenv').config()
import { Listing } from 'core/listing'
import { Collection } from 'lib/db'
import { connectToDatabase } from 'lib/mongodb'

run()

async function run() {
  const { db } = await connectToDatabase()
  const listingsCollection = db.collection<Listing>(Collection.LISTINGS)
  const listings = await listingsCollection
    .find({ pastPrices: { $size: 5 } })
    .toArray()
  console.log(listings)
}

// 20182566001_EA clementines

// Create a group with:
// 20872671001_EA Avocado, 5/6-Count
// 20135377001_EA Cauliflower
// 20032320001_EA Radishes
