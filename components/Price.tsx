import { Flex, Text } from '@chakra-ui/react'
import { Listing } from 'core/listing'
import { ListingPrice, writePrice } from 'core/price'
import { ListingSize, writeSize } from 'core/size'
import React from 'react'

type Props = {
  listing: Listing
  size?: ListingSize
}

export default function Price({ listing, size }: Props) {
  return (
    <Flex
      lineHeight={1}
      alignItems="flex-end"
      direction="column"
      pos="relative"
    >
      {!size && (
        <Text fontSize="xs" pos="absolute" top={-4}>
          {listing.size.averageWeight && '(est.)'}
        </Text>
      )}
      <Text fontSize="xl" fontWeight="bold">
        {writePrice(listing.price, listing.size, size)}
      </Text>
      {size && (
        <Text fontSize="xs" pos="absolute" bottom={-4}>
          /{writeSize(size)}
        </Text>
      )}
    </Flex>
  )
}
