import { Provider as SessionProvider } from 'next-auth/client'
import React from 'react'
import 'reflect-metadata'
import { AuthProvider } from 'utils/user-context'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: 'gray.900',
        bgColor: 'gray.100',
        height: '100vh',
        fontFamily: 'arial',
      },
      '#__next': {
        height: '100%',
      },
    },
  },
})
