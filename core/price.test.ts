import { makeTestSize } from 'tests/utils'
import { makePrice } from './price'
import { Units } from './size'

describe('makePrice', () => {
  it('should return the price val directly if no average weight', () => {
    const priceVal = 5
    const size = makeTestSize({})

    const price = makePrice(size, priceVal, new Date(), false)

    expect(price.value).toBe(priceVal)
  })

  it('should return the computed price if there is an average weight', () => {
    const priceVal = 5
    const size = makeTestSize({
      averageWeight: 500,
      value: 1000,
      unit: Units.g,
    })
    const expectedPriceVal = 10

    const price = makePrice(size, priceVal, new Date(), false)

    expect(price.value).toBe(expectedPriceVal)
  })
})
