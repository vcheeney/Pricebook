export type User = {
  _id: string
  name: string
  email: string
  image: string
  createdAt: Date
  updatedAt: Date
  approved?: boolean
}

export type GetUserById = (id: string) => Promise<User>
export type GetUserByEmail = (email: string) => Promise<User>
