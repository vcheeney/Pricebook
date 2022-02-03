import React from 'react'
import { HStack } from '@chakra-ui/react'

type Props = {
  children: JSX.Element[]
  shadow?: string
}

export default function Card({ children, shadow }: Props) {
  return (
    <HStack
      bgColor="white"
      w="full"
      borderRadius="lg"
      p={4}
      spacing="1rem"
      shadow={shadow || 'sm'}
      position="relative"
    >
      {children}
    </HStack>
  )
}
