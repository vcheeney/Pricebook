import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Flex,
  CloseButton,
  DrawerBody,
  Text,
  useDisclosure,
  Heading,
  HStack,
  IconButton,
  Box,
  Circle,
  Image,
  VStack,
  Square,
  Stack,
  Tooltip,
  Input,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelectedListings } from 'utils/db-hooks'
import { Group } from 'core/group'
import ListingsChart from 'components/ListingsChart'
import { FaMoneyBillWave, FaPen, FaTag } from 'react-icons/fa'
import { HiBadgeCheck } from 'react-icons/hi'
import StoreImage from 'components/StoreImage'
import { getStoreColor } from 'utils/constants'
import { Per100g } from 'core/size'
import Price from 'components/Price'
import ListingBadge from 'components/ListingBadge'
import { findBestValueListing, findCheapestListing } from 'core/listing'
import ListingPrice from 'components/ListingPrice'

type Props = {
  group: Group
  setOpenGroup: (g: Group) => void
}

export default function GroupDrawer({ setOpenGroup, group }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: listings, status } = useSelectedListings(
    group.listingsThumbnail.map((l) => l._id)
  )
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    onOpen()
  }, [])

  function close() {
    onClose()
    setTimeout(() => setOpenGroup(null), 500)
  }

  return (
    <Drawer onClose={close} isOpen={isOpen} size="lg">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            <Flex justify="space-between">
              <Text>Détails du groupe</Text>
              <CloseButton onClick={close} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Flex justify="space-between" mb={8}>
              <Box position="relative">
                {isEditing ? (
                  <Input placeholder="large size" size="lg" />
                ) : (
                  <Heading>{group.name}</Heading>
                )}
                <Text pos="absolute" bottom={-6}>
                  {group.listingsThumbnail.length} Listings
                </Text>
              </Box>
              <IconButton
                aria-label="Search database"
                icon={<FaPen />}
                onClick={() => setIsEditing(true)}
              />
            </Flex>
            <Box>
              <VStack spacing={4} mb={4}>
                {listings?.map((l) => (
                  <HStack
                    key={l._id}
                    bg={getStoreColor(l.store, 0.1)}
                    px={4}
                    py={3}
                    rounded={8}
                    w="full"
                  >
                    <Square
                      size={12}
                      rounded={8}
                      bgColor="white"
                      px={1}
                      pos="relative"
                    >
                      <Box pos="absolute" top={-1} left={-3}>
                        <StoreImage store={l.store} link={l.link} width={8} />
                      </Box>
                      <Image src={l.image} />
                    </Square>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="full"
                    >
                      <Stack spacing={0}>
                        <Text
                          fontWeight="bold"
                          fontSize="xs"
                          noOfLines={1}
                          lineHeight="shorter"
                        >
                          {l.brand || 'NA'}
                        </Text>
                        <Text noOfLines={1}>{l.name}</Text>
                      </Stack>
                      <HStack spacing={6}>
                        <HStack>
                          {findBestValueListing(listings)._id === l._id && (
                            <ListingBadge
                              Icon={HiBadgeCheck}
                              label="Cet article est le plus avantageux du groupe"
                            />
                          )}
                          {findCheapestListing(listings)._id === l._id && (
                            <ListingBadge
                              Icon={FaMoneyBillWave}
                              label="Cet article est le moins cher du groupe"
                            />
                          )}
                          {l.price.isSale && (
                            <ListingBadge
                              Icon={FaTag}
                              label="Cet article est en rabais"
                            />
                          )}
                        </HStack>
                        <HStack
                          spacing={6}
                          flex="none"
                          minW={36}
                          justifyContent="flex-end"
                        >
                          <ListingPrice listing={l} />
                          <ListingPrice listing={l} target={Per100g} />
                        </HStack>
                      </HStack>
                    </Flex>
                  </HStack>
                ))}
              </VStack>
              <ListingsChart listings={listings} />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
