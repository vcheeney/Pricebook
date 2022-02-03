import {
  Flex,
  HStack,
  Text,
  Image,
  Square,
  IconButton,
  Tooltip,
  SimpleGrid,
  Box,
} from '@chakra-ui/react'
import { ListingThumbnail } from 'core/listing'
import { Per100g } from 'core/size'
import React from 'react'
import { FaEye, FaTrash } from 'react-icons/fa'
import { getStoreColor } from 'utils/constants'
import ListingPrice from './ListingPrice'
import ListingSizeText from './ListingSizeText'
import StoreImage from './StoreImage'

type Props = {
  listing: ListingThumbnail
  actions: JSX.Element[]
}

export default function ListingListItem({ listing, actions }: Props) {
  const { store, image, size, brand, name } = listing
  return (
    <HStack
      spacing={6}
      bgColor="white"
      borderRadius="lg"
      alignItems="center"
      px={6}
      py={2}
      mb={2}
      shadow="sm"
    >
      <HStack spacing={2}>{actions}</HStack>
      <StoreImage store={store} width={12} />
      <Tooltip label={`${brand ? `${brand}, ` : ''}${name}`} hasArrow>
        <Square size={12} borderRadius="lg" position="relative">
          <Image src={image} fallbackSrc="https://via.placeholder.com/96" />
        </Square>
      </Tooltip>
      <SimpleGrid columns={3} flexGrow={1} spacing={2}>
        <Flex>
          <ListingPrice listing={listing} />
        </Flex>
        <Flex justify="center">
          <ListingSizeText size={size} />
        </Flex>
        <Flex justify="flex-end">
          <ListingPrice listing={listing} target={Per100g} />
        </Flex>
      </SimpleGrid>
    </HStack>
  )
}
