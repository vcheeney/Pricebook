import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../Navbar'
import Container from './Container'

type Props = {
  children: JSX.Element
  hideSignIn?: boolean
}

export default function AppLayout({ children, hideSignIn = false }: Props) {
  return (
    <Box
      h="full"
      borderTopColor="green.500"
      borderTopWidth={6}
      overflowY="scroll"
    >
      <Container>
        <Navbar hideSignIn={hideSignIn} />
        {children}
      </Container>
    </Box>
  )
}
