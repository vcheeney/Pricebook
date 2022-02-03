import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {
  children: JSX.Element[] | JSX.Element
}

export default function Container({ children }: Props) {
  return (
    <Box h="full" px={4} w="full" maxW={{ xl: '1400px' }} mx="auto">
      {children}
    </Box>
  )
}
