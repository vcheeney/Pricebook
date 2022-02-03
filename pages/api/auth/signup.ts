import { hash } from 'bcryptjs'
import { Collection } from 'lib/db'
import { connectToDatabase } from 'lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body

    //Validate
    if (!email || !email.includes('@') || !password) {
      res.status(422).json({ message: 'Invalid Data' })
      return
    }

    //Connect with database
    const { db } = await connectToDatabase()

    //Check existing
    const userAlreadyExists = await db
      .collection(Collection.USERS)
      .findOne({ email: email })

    //Send error response if duplicate user is found
    if (userAlreadyExists) {
      res.status(422).json({ message: 'User already exists' })
      return
    }

    //Hash password
    const status = await db.collection('users').insertOne({
      email,
      password: await hash(password, 12),
    })

    //Send success response
    res.status(201).json({ message: 'User created', ...status })
  } else {
    //Response for other than POST method
    res.status(500).json({ message: 'Route not valid' })
  }
}
