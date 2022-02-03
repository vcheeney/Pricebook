import { NextApiResponse } from 'next'
import { CustomError } from 'core/errors'
import { postError } from 'lib/db'

const env = process.env.ENV

type Response = {
  name: string
  message: string
  stack?: string
  context?: string
}

export async function errorMiddleware(error: Error, res: NextApiResponse) {
  try {
    await postError(error as CustomError)
  } catch (err) {
    console.error(err)
  }
  if (error instanceof CustomError) {
    const response: Response = {
      name: error.name,
      message: error.message,
    }
    if (env === 'local') {
      response.stack = error.stack
      response.context = error.context
    }
    res.statusCode = 500
    res.json(response)
  } else {
    const response: Response = {
      name: 'Error',
      message: 'An unknown error has occured',
    }
    if (env === 'local') {
      response.stack = error.stack
    }
    res.statusCode = 500
    res.json(response)
  }
}
