import { compare } from 'bcryptjs'
import { Collection, getUserByEmail } from 'lib/db'
import { connectToDatabase } from 'lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const googleSignInEnabled = process.env.ENABLE_GOOGLE_SIGN_IN === 'true'

const options = {
  providers: [
    Providers.Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        //Connect to DB
        const { db } = await connectToDatabase()

        //Find user with the email
        const result = await db.collection(Collection.USERS).findOne({
          email: credentials.email,
        })

        //Not found - send error res
        if (!result) {
          throw new Error('No user found with the email')
        }

        //Check hased password with DB password
        const checkPassword = await compare(
          credentials.password,
          result.password
        )

        //Incorrect password - send response
        if (!checkPassword) {
          throw new Error('Password doesnt match')
        }

        //Else send success response
        const user = { email: result.email }
        return user
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    redirect: async (url, _) => Promise.resolve('/'),
    session: async (session, u: any) => {
      const user = await getUserByEmail(u.email)
      return Promise.resolve({
        ...session,
        customUser: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
    },
  },
  secret: process.env.AUTH_SECRET,
  database: process.env.MONGODB_URI,
  session: {
    jwt: true,
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
