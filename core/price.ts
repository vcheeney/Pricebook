import { Listing } from './listing'
import { getTotalSize, Per100g, ListingSize, writeSize } from './size'

export type ListingPrice = {
  value: number
  isSale?: boolean
  setDate: Date
  lastSeenDate: Date
}

export function makePrice(
  size: ListingSize,
  priceVal: number,
  date: Date,
  isSale: boolean
): ListingPrice {
  const { averageWeight, value } = size
  return {
    lastSeenDate: date,
    setDate: date,
    value: averageWeight ? (priceVal * value) / averageWeight : priceVal,
    isSale,
  }
}

export const writePrice = (
  price: ListingPrice,
  size: ListingSize,
  target?: ListingSize
) => {
  if (target) return writeComparisonPrice(price, size, target)
  return `$${price.value.toFixed(2)}`
}

const writeComparisonPrice = (
  price: ListingPrice,
  size: ListingSize,
  target: ListingSize
) => `$${getComparisonPrice(price, size, target).toFixed(2)}`

export const getComparisonPrice = (
  price: ListingPrice,
  size: ListingSize,
  target = Per100g
): number => (price.value * getTotalSize(target)) / getTotalSize(size)

export const getPrice = (p: Listing): number => {
  if (p.size.averageWeight) return getEstimatedPrice(p)
  return p.price.value
}

const getEstimatedPrice = (p: Listing): number => {
  const { price, size } = p
  return (price.value * size.averageWeight) / size.value
}
