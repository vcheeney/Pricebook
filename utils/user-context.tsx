import { User } from 'core/user'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect } from 'react'

const userContext = createContext(null)

type UseAuthValue = {
  user: User
  loading: boolean
}

export function useUser(): UseAuthValue {
  return useContext(userContext)
}

export function AuthProvider({ children }) {
  const [session, loading] = useSession()

  const data: UseAuthValue = {
    user: session?.customUser,
    loading: loading,
  }

  return <userContext.Provider value={data}>{children}</userContext.Provider>
}

export function useRequireUser(redirectUrl = '/') {
  const userContext = useUser()
  const router = useRouter()

  useEffect(() => {
    const { user, loading } = userContext
    if (!user && !loading) router.push(redirectUrl)
  }, [userContext])

  return userContext
}
