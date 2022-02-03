import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  ScaleFade,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import FullPageSpinner from 'components/FullPageSpinner'
import ListingCard from 'components/ListingCard'
import ListingChip from 'components/ListingChip'
import ListingsSearch from 'components/ListingsSearch'
import SelectedListingsChipEmptyState from 'components/SelectedListingsChipEmptyState'
import { ListingThumbnail } from 'core/listing'
import { SearchParams } from 'lib/db'
import React, { useState } from 'react'
import { useListingsThumbnail } from 'utils/db-hooks'
import { useRequireUser } from 'utils/user-context'
import ListingDrawer from './ListingDrawer'

type Props = {
  onClose: any
  isOpen: boolean
  selectedListingsThumbnail: ListingThumbnail[]
  insert: (val: any) => void
  remove: (index: number) => void
}

const initParams: SearchParams = { page: 0, query: '' }

export default function ListingsDrawer({
  onClose,
  isOpen,
  selectedListingsThumbnail,
  insert,
  remove,
}: Props) {
  const { loading } = useRequireUser()
  const [searchParams, setSearchParams] = useState<SearchParams>(initParams)
  const [listingDrawer, setListingDrawer] = useState<ListingThumbnail>()

  const { data, error, fetchNextPage, isFetching, hasNextPage } =
    useListingsThumbnail(searchParams)

  const listingsThumbnail: ListingThumbnail[] =
    data?.pages?.reduce<ListingThumbnail[]>(
      (res, cur) => [...res, ...cur.listingsThumbnail],
      []
    ) || []

  if (loading) return <FullPageSpinner />
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="full" placement="bottom">
        <DrawerOverlay>
          <DrawerContent bgColor="gray.100">
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading fontSize="2xl" fontWeight="medium">
                {selectedListingsThumbnail.length
                  ? `${selectedListingsThumbnail.length} selected listings`
                  : 'Please select listings'}
              </Heading>
              <Box h={16} my={4}>
                {selectedListingsThumbnail.length ? (
                  <HStack spacing={4}>
                    {selectedListingsThumbnail.map((l) => (
                      <ScaleFade initialScale={0.7} in={!!l} key={l._id}>
                        <ListingChip
                          listing={l}
                          unselect={() =>
                            remove(
                              selectedListingsThumbnail.findIndex(
                                (sl) => sl._id === l._id
                              )
                            )
                          }
                        />
                      </ScaleFade>
                    ))}
                  </HStack>
                ) : (
                  <SelectedListingsChipEmptyState />
                )}
              </Box>
            </DrawerHeader>
            <DrawerBody>
              <Box>
                <Flex
                  justify="space-between"
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <ListingsSearch
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                </Flex>
                <SimpleGrid gap={4} columns={[1, 1, 2, 2, 3]}>
                  {listingsThumbnail.map((listing) => (
                    <ListingCard
                      isSelected={
                        !!selectedListingsThumbnail.find(
                          (l) => l._id === listing._id
                        )
                      }
                      isSelectMode={true}
                      listing={listing}
                      key={listing._id}
                      showListingDrawer={() => {
                        setListingDrawer(listing)
                      }}
                      selectListing={() => {
                        if (
                          !!selectedListingsThumbnail.find(
                            (l) => l._id === listing._id
                          )
                        ) {
                          remove(
                            selectedListingsThumbnail.findIndex(
                              (l) => l._id === listing._id
                            )
                          )
                        } else {
                          insert(listing)
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
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {listingDrawer && (
        <ListingDrawer
          initialListing={listingDrawer}
          setOpenListing={(l) => setListingDrawer(l)}
        />
      )}
    </>
  )
}
