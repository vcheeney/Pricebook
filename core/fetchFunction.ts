import { Listing, Store } from './listing'

export type FetchFunction = (
  date: Date,
  clearTmp?: boolean
) => Promise<ListingsMapping>

export type ParsingFailure = {
  error: Error
  result: any
}

export type ListingsMapping = {
  listings: Listing[]
  parsingFailures: ParsingFailure[]
}

export type GetFetchFunction = (store: Store) => FetchFunction
