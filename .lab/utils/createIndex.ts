require('dotenv').config()
import { Collection } from 'lib/db'
import { connectToDatabase } from 'lib/mongodb'

run()

async function run() {
  const { db } = await connectToDatabase()
  await db.collection(Collection.LISTINGS).createIndex(
    {
      code: 'text',
      name: 'text',
      brand: 'text',
      store: 'text',
    },
    {
      // weights: {
      //   name: 5,
      // },
      name: 'TextIndex',
    }
  )
  console.log('Index created!')
}
