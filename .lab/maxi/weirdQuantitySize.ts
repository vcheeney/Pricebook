import { fetchAllMaxiRawResults } from 'core/fetchers/fetchMaxiListings'

run()

async function run() {
  const results = await fetchAllMaxiRawResults(new Date())
  const weirdRes = results.filter(
    (res) => res.prices.price.quantity !== 1 && !res.averageWeight
  )
  console.log(weirdRes)
}
