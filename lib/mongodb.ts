import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

let client = null
let db = null

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  if (client && db) return { client, db }

  client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  db = client.db(dbName)

  return { client, db }
}
