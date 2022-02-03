import { Box, Text, Tooltip } from '@chakra-ui/react'
import { ListingSize, writeSize } from 'core/size'
import React from 'react'

type Props = {
  size: ListingSize
}

export default function ListingSizeText({ size }: Props) {
  const labelText = "Poids moyen d'un emballage"
  return (
    <Tooltip
      label={labelText}
      aria-label="A tooltip"
      isDisabled={!size.averageWeight}
      hasArrow
    >
      <Box position="relative" flexGrow={0}>
        <Text>{writeSize(size)}</Text>
        {size.averageWeight && (
          <Text position="absolute" top="-5px" right="-7px" fontSize="lg">
            *
          </Text>
        )}
      </Box>
    </Tooltip>
  )
}
