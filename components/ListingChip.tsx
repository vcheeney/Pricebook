import { Box, Square, Image, Tooltip, IconButton } from '@chakra-ui/react'
import { Listing } from 'core/listing'
import React from 'react'
import { FaTimes, FaTimesCircle } from 'react-icons/fa'
import { getStoreColor } from 'utils/constants'
import StoreImage from './StoreImage'

type Props = {
  listing: Listing
  unselect: () => void
  size?: 'normal' | 'small'
}

export default function ListingChip({
  listing,
  unselect,
  size = 'normal',
}: Props) {
  const squareSize = size === 'normal' ? 16 : 8
  const borderRadius = size === 'normal' ? 16 : 8
  const borderWidth = size === 'normal' ? 3 : 2
  const borderColor = getStoreColor(listing.store)
  const removePos = size === 'normal' ? -3 : -3

  return (
    <Tooltip
      label={`${listing.brand ? `${listing.brand}, ` : ''}${listing.name}`}
      aria-label="Brand and name of the product"
      hasArrow
    >
      <Square
        size={squareSize}
        borderRadius={borderRadius}
        position="relative"
        borderWidth={borderWidth}
        borderColor={borderColor}
        userSelect="none"
        backgroundColor="white"
      >
        <Image
          src={listing.image}
          fallbackSrc="https://via.placeholder.com/96"
          borderRadius={borderRadius}
        />
        <Box
          position="absolute"
          bottom={-4}
          background="white"
          borderColor={borderColor}
          borderWidth={borderWidth}
          p={1}
          px={2}
          rounded="full"
        >
          <StoreImage width={4} store={listing.store} />
        </Box>
        <IconButton
          position="absolute"
          top={removePos}
          left={removePos}
          variant="solid"
          borderRadius="full"
          colorScheme="black"
          _hover={{
            transform: 'scale(1.1)',
          }}
          backgroundColor="gray.600"
          transition="transform 0.15s"
          aria-label="Send email"
          icon={<FaTimes />}
          size="xs"
          onClick={unselect}
        />
      </Square>
    </Tooltip>
  )
}
