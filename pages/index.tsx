import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react'
import FullPageSpinner from 'components/FullPageSpinner'
import AppLayout from 'components/layouts/AppLayout'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useUser } from 'utils/user-context'

export default function Home() {
  const { user, loading } = useUser()
  const [connecting, setConnecting] = useState(false)
  const router = useRouter()

  if (loading) return <FullPageSpinner />
  return (
    <AppLayout>
      <Box h="full">
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          h="75%"
        >
          <Container centerContent maxW="xl">
            <Heading textAlign="center">
              The Solution to Plan Your Groceries in Minutes
            </Heading>
            {!user ? (
              <Button
                size="lg"
                colorScheme="green"
                mt={8}
                isLoading={connecting}
                onClick={() => {
                  router.push('/auth')
                }}
              >
                Get Started
              </Button>
            ) : (
              <Button
                size="lg"
                colorScheme="green"
                mt={8}
                loadingText="Connexion en cours..."
                isLoading={connecting}
                onClick={() => {
                  router.push('/listings')
                }}
              >
                Check listings
              </Button>
            )}
          </Container>
        </Flex>
      </Box>
    </AppLayout>
  )
}
