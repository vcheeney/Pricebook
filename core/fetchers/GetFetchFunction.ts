import { UnsupportedStoreError } from 'core/errors'
import { GetFetchFunction } from 'core/fetchFunction'
import { Store } from 'core/listing'
import { fetchIgaListings } from './fetchIgaListings'
import { fetchMaxiListings } from './fetchMaxiListings'
import { fetchProvigoListings } from './fetchProvigoListings'

export const getFetchFunction: GetFetchFunction = (store) => {
  switch (store) {
    case Store.maxi:
      return fetchMaxiListings
    case Store.provigo:
      return fetchProvigoListings
    case Store.iga:
      return fetchIgaListings
    default:
      throw new UnsupportedStoreError(`${store} is not supported`, { store })
  }
}
