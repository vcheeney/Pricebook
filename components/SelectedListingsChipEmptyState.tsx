import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function SelectedListingsChipEmptyState() {
  const color = 'gray.400'
  return (
    <Flex
      alignItems="center"
      borderWidth={2}
      borderStyle="dashed"
      borderColor={color}
      color={color}
      borderRadius="lg"
      h="full"
    >
      <Text fontWeight="normal" ml={4}>
        The selected listings will appear here
      </Text>
    </Flex>
  )
}
