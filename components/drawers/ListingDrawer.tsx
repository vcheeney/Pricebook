import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Flex,
  CloseButton,
  DrawerBody,
  Square,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Text,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import { writePrice } from 'core/price'
import { Listing } from 'core/listing'
import { writeSize, Per100g } from 'core/size'
import React, { useEffect, useState } from 'react'
import { fetchListing } from 'utils/db-hooks'
import StoreImage from '../StoreImage'
import ListingsChart from '../ListingsChart'

type Props = {
  initialListing: Listing
  setOpenListing: (l: Listing) => void
}

export default function ListingDrawer({
  initialListing,
  setOpenListing,
}: Props) {
  const [listing, setListing] = useState(initialListing)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (initialListing) {
      fetchListing(initialListing._id).then(setListing)
      onOpen()
    }
  }, [initialListing])

  function close() {
    onClose()
    setTimeout(() => setOpenListing(null), 500)
  }

  return (
    <Drawer onClose={close} isOpen={isOpen} size="md">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            <Flex justify="space-between">
              <Text>Listing Details</Text>
              <CloseButton onClick={close} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Flex direction="column">
              <Flex justify="center" w="full" my={4}>
                <Square size={40}>
                  <Image src={listing.image} />
                </Square>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="bold" fontSize="2xl">
                  {listing.name}
                </Text>
                <StoreImage
                  store={listing.store}
                  width={16}
                  link={listing.link}
                />
              </Flex>
              <Text fontSize="xl">{writeSize(listing.size)}</Text>
              <Flex justify="space-between" fontSize="xl" fontWeight="bold">
                <Text>{writePrice(listing.price, listing.size)}</Text>
                <Text color="gray.600">
                  {writePrice(listing.price, listing.size, Per100g)}
                </Text>
              </Flex>
              <Accordion allowMultiple my={2}>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" padding={0}>
                      Description
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <ListingsChart listings={[listing]} />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
