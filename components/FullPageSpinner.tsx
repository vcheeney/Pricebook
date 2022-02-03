import { Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

export default function FullPageSpinner() {
  return (
    <Flex h="full" justifyContent="center" alignItems="center">
      <Spinner size="xl" thickness="4px" color="green.500" />
    </Flex>
  )
}
