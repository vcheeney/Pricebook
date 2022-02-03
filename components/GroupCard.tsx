import React from 'react'
import { Group } from 'core/group'
import {
  Square,
  Flex,
  Text,
  Image,
  AvatarGroup,
  Avatar,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { writePrice } from 'core/price'
import Card from './Card'
import { FaTrash } from 'react-icons/fa'
import { useDeleteGroup } from 'utils/db-hooks'

type Props = {
  group: Group
  onClick: () => void
}

export default function GroupCard({ group, onClick }: Props) {
  const { mutate } = useDeleteGroup()
  return (
    <Card>
      <Square size={24} borderRadius="lg" onClick={onClick} cursor="pointer">
        <Image src={group.listingsThumbnail[0].image} />
      </Square>
      <Flex direction="column" w="full">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          color="gray.300"
        >
          <HStack spacing={2}>
            <Text fontWeight="bold" casing="uppercase" color="gray.500">
              {group.listingsThumbnail.length} Listings
            </Text>
            <AvatarGroup
              size="xs"
              max={6}
              spacing={-2}
              fontSize="xs"
              color="transparent"
            >
              {group.listingsThumbnail.map((l) => (
                <Avatar
                  key={l._id}
                  src={l.image}
                  showBorder
                  borderColor="green.500"
                  // borderWidth={2}
                  bgColor="white"
                />
              ))}
            </AvatarGroup>
          </HStack>
          <IconButton
            aria-label="Delete group"
            icon={<FaTrash size={16} />}
            size="xs"
            color="gray.500"
            onClick={() => mutate(group._id)}
          />
        </Flex>
        <Text fontSize="xl">{group.name}</Text>
        <Text>Best price is at {group.listingsThumbnail[0].store}</Text>
        <Text fontWeight="bold">
          {writePrice(
            group.listingsThumbnail[0].price,
            group.listingsThumbnail[0].size
          )}
        </Text>
      </Flex>
    </Card>
  )
}
