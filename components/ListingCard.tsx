import React, { useState } from 'react'
import { HStack, Square, Flex, Text, Image, Box } from '@chakra-ui/react'
import { Listing } from 'core/listing'
import { Per100g } from 'core/size'
import { FaCheckCircle, FaRegCircle, FaSearchPlus } from 'react-icons/fa'
import StoreImage from './StoreImage'
import ListingPrice from './ListingPrice'
import { getStoreColor } from 'utils/constants'
import ListingSizeText from './ListingSizeText'

type Props = {
  listing: Listing
  isSelected: boolean
  isSelectMode: boolean
  showListingDrawer: () => void
  selectListing: () => void
}

export default function ListingCard({
  listing,
  isSelected,
  isSelectMode,
  showListingDrawer,
  selectListing,
}: Props) {
  const [isHoveringCard, setIsHoveringCard] = useState(false)
  const [isHoveringMagnifier, setIsHoveringMagnifier] = useState(false)

  return (
    <Box
      w="full"
      borderRadius="lg"
      shadow="sm"
      position="relative"
      onMouseEnter={() => setIsHoveringCard(true)}
      onMouseLeave={() => setIsHoveringCard(false)}
      onClick={() => {
        if (isSelectMode) selectListing()
        else showListingDrawer()
      }}
      cursor="pointer"
      bgColor="white"
      borderWidth={5}
      borderColor={isSelected ? 'green.500' : 'transparent'}
      transition="border 0.15s"
    >
      <Box
        position="absolute"
        top={3}
        left={3}
        opacity={isSelected ? 1 : isSelectMode || isHoveringCard ? 0.5 : 0}
        color={
          isSelected || (isSelectMode && isHoveringCard && !isHoveringMagnifier)
            ? 'green.500'
            : 'gray.300'
        }
        _hover={{
          color: 'green.500',
        }}
        onClick={(e) => {
          e.stopPropagation()
          selectListing()
        }}
        zIndex={1}
        transition="color 0.15s"
      >
        {isSelected || isHoveringCard ? (
          <FaCheckCircle size={26} />
        ) : (
          <FaRegCircle size={26} />
        )}
      </Box>
      <Box
        transform={isSelected ? 'scale(0.95)' : ''}
        transition="transform 0.1s"
        bgColor="white"
        w="full"
        borderRadius="lg"
        p={4}
      >
        {isSelectMode && (
          <Flex
            position="absolute"
            top={3}
            right={3}
            width={16}
            height={16}
            justify="flex-end"
            opacity={isHoveringCard ? 0.5 : 0}
            color="gray.300"
            _hover={{
              color: 'green.500',
            }}
            onClick={(e) => {
              e.stopPropagation()
              showListingDrawer()
            }}
            onMouseEnter={() => setIsHoveringMagnifier(true)}
            onMouseLeave={() => setIsHoveringMagnifier(false)}
            transition="color 0.15s"
          >
            <FaSearchPlus size={26} />
          </Flex>
        )}
        <HStack spacing="1rem" userSelect="none" alignItems="stretch">
          <Square size={24} borderRadius="lg" position="relative">
            <Image
              src={listing.image}
              fallbackSrc="https://via.placeholder.com/96"
            />
            <Box
              position="absolute"
              bottom={-4}
              background="white"
              borderColor={getStoreColor(listing.store)}
              borderWidth={3}
              p={1}
              px={2}
              rounded="full"
            >
              <StoreImage width={8} store={listing.store} />
            </Box>
          </Square>
          <Flex direction="column" w="full" overflow="hidden">
            <Text
              fontWeight="bold"
              casing="uppercase"
              color="gray.500"
              lineHeight="shorter"
            >
              {listing.brand || ''}
            </Text>
            <Text
              fontSize="xl"
              noOfLines={1}
              isTruncated
              lineHeight="shorter"
              display="inline-block"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {listing.name}
            </Text>
            <Flex>
              <ListingSizeText size={listing.size} />
            </Flex>
            <Flex
              justify="space-between"
              mt={1}
              flexGrow={1}
              alignItems="flex-end"
              pb="2"
            >
              <ListingPrice listing={listing} horizontal />
              <ListingPrice listing={listing} horizontal target={Per100g} />
            </Flex>
          </Flex>
        </HStack>
      </Box>
    </Box>
  )
}
