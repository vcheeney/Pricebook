import { Box, Flex, HStack, Text, Tooltip } from '@chakra-ui/react'
import { ListingThumbnail } from 'core/listing'
import { writePrice } from 'core/price'
import { ListingSize, writeSize } from 'core/size'
import React from 'react'

type Props = {
  listing: ListingThumbnail
  horizontal?: boolean
  target?: ListingSize
}

export default function ListingPrice({ horizontal, listing, target }: Props) {
  if (target)
    return <ListingComparisonPrice listing={listing} target={target} />
  if (horizontal)
    return <ListingHorizontalPrice listing={listing} target={target} />
  return <ListingVerticalPrice listing={listing} target={target} />
}

function ListingComparisonPrice({ listing, target }: Props) {
  return (
    <CenteredPriceBox listing={listing} target={target}>
      <Box position="absolute" bottom="-10px" right={0}>
        <Text fontSize="xs">/{writeSize(target)}</Text>
      </Box>
    </CenteredPriceBox>
  )
}

function ListingHorizontalPrice({ listing, target }: Props) {
  const { lastHigherPriceSeen, size } = listing
  return (
    <HStack spacing={2}>
      <MainPriceBox listing={listing} target={target} />
      {shouldShowOldPrice(listing) && (
        <Text textDecor="line-through" color="gray.600" fontSize="lg">
          {writePrice(lastHigherPriceSeen, size, target)}
        </Text>
      )}
    </HStack>
  )
}

function ListingVerticalPrice({ listing, target }: Props) {
  const { lastHigherPriceSeen, size } = listing
  return (
    <Box position="relative">
      <MainPriceBox listing={listing} target={target} />
      <Box position="absolute" top="-10px" right={1} fontSize="xs">
        {shouldShowOldPrice(listing) && (
          <Text textDecor="line-through" color="gray.600">
            {writePrice(lastHigherPriceSeen, size, target)}
          </Text>
        )}
      </Box>
    </Box>
  )
}

const shouldShowOldPrice = (listing: ListingThumbnail) =>
  listing.price.isSale && listing.lastHigherPriceSeen

type MainPriceBoxProps = {
  listing: ListingThumbnail
  target?: ListingSize
  children?: JSX.Element
}

function MainPriceBox({ listing, target }: MainPriceBoxProps) {
  const { price, size } = listing
  const labelText = "Prix moyen d'un emballage"

  return (
    <Tooltip
      label={labelText}
      aria-label="A tooltip"
      isDisabled={!listing.size.averageWeight}
      hasArrow
    >
      <Box>
        <CenteredPriceBox listing={listing} target={target}>
          {listing.size.averageWeight && (
            <Text
              position="absolute"
              top="-5px"
              right="-5px"
              fontWeight="bold"
              fontSize="lg"
            >
              *
            </Text>
          )}
        </CenteredPriceBox>
      </Box>
    </Tooltip>
  )
}

type CenteredPriceBoxProps = {
  listing: ListingThumbnail
  target?: ListingSize
  children?: JSX.Element
}

function CenteredPriceBox({
  listing,
  target,
  children,
}: CenteredPriceBoxProps) {
  const { price, size } = listing
  return (
    <Box
      position="relative"
      color={listing.price.isSale ? 'red.500' : 'gray.700'}
    >
      <Text fontSize="xl" fontWeight="bold">
        {writePrice(price, size, target)}
      </Text>
      {children}
    </Box>
  )
}
