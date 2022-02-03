import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Slide,
  Text,
} from '@chakra-ui/react'
import FullPageSpinner from 'components/FullPageSpinner'
import { useRequireUser } from 'utils/user-context'
import ListingCard from 'components/ListingCard'
import { useListingsThumbnail } from 'utils/db-hooks'
import { ListingThumbnail } from 'core/listing'
import ListingDrawer from 'components/drawers/ListingDrawer'
import CreateGroupDrawer from 'components/drawers/CreateGroupDrawer'
import AppLayout from 'components/layouts/AppLayout'
import { SearchParams } from 'lib/db'
import ListingsSearch from 'components/ListingsSearch'
import Container from 'components/layouts/Container'
import { FaColumns, FaPlus, FaTimes } from 'react-icons/fa'

const initParams: SearchParams = { page: 0, query: '' }

export default function Listings() {
  const { loading } = useRequireUser()
  const [searchParams, setSearchParams] = useState<SearchParams>(initParams)
  const [listingDrawer, setListingDrawer] = useState<ListingThumbnail>()
  const [showCreatingGroupDrawer, setShowCreatingGroupDrawer] = useState(false)
  const [selectedListingsThumbnail, setSelectedListingsThumbnail] = useState([])

  const { data, error, fetchNextPage, isFetching, hasNextPage } =
    useListingsThumbnail(searchParams)

  if (error) return <h1>{error.message}</h1>

  const listingsThumbnail: ListingThumbnail[] =
    data?.pages?.reduce((res, cur) => [...res, ...cur.listingsThumbnail], []) ||
    []

  const isSelectMode = !!selectedListingsThumbnail.length

  if (loading) return <FullPageSpinner />
  return (
    <>
      <Slide direction="top" in={isSelectMode} style={{ zIndex: 2 }}>
        <Box w="full" bgColor="white" py={4} shadow="md">
          <Container>
            <Flex justify="space-between">
              <HStack spacing={4}>
                <IconButton
                  aria-label="Cancel selection"
                  icon={<FaTimes size={20} />}
                  onClick={() => setSelectedListingsThumbnail([])}
                />
                <Text fontSize="xl">
                  {selectedListingsThumbnail.length} selected listings
                </Text>
              </HStack>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Compare listings"
                  icon={<FaColumns />}
                />
                <IconButton aria-label="Create a group" icon={<FaPlus />} />
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Slide>
      <AppLayout>
        <Box>
          <Flex justify="space-between" flexWrap="wrap" alignItems="center">
            <ListingsSearch
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Flex>
          <SimpleGrid gap={4} columns={[1, 1, 2, 2, 3]}>
            {listingsThumbnail.map((listing) => (
              <ListingCard
                isSelected={selectedListingsThumbnail.includes(listing._id)}
                isSelectMode={!!selectedListingsThumbnail.length}
                listing={listing}
                key={listing._id}
                showListingDrawer={() => {
                  setListingDrawer(listing)
                }}
                selectListing={() => {
                  if (selectedListingsThumbnail.includes(listing._id)) {
                    setSelectedListingsThumbnail(
                      selectedListingsThumbnail.filter(
                        (id) => id !== listing._id
                      )
                    )
                  } else {
                    setSelectedListingsThumbnail([
                      ...selectedListingsThumbnail,
                      listing._id,
                    ])
                  }
                }}
              />
            ))}
          </SimpleGrid>
          <Flex py={8} justify="center">
            <Button
              onClick={() => fetchNextPage()}
              isLoading={isFetching}
              colorScheme="green"
              isDisabled={!hasNextPage}
            >
              Load more
            </Button>
          </Flex>
        </Box>
      </AppLayout>
      {listingDrawer && (
        <ListingDrawer
          initialListing={listingDrawer}
          setOpenListing={(l) => setListingDrawer(l)}
        />
      )}
      {showCreatingGroupDrawer && (
        <CreateGroupDrawer
          listingsThumbnail={listingsThumbnail.filter((l) =>
            selectedListingsThumbnail.find((id) => id === l._id)
          )}
          isCreatingGroup={showCreatingGroupDrawer}
          setCreatingGroup={setShowCreatingGroupDrawer}
        />
      )}
    </>
  )
}
