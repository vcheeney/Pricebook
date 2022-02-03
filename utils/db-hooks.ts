import axios from 'axios'
import { Group } from 'core/group'
import { Listing } from 'core/listing'
import { GetListingsResponse } from 'pages/api/listings'
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from 'react-query'

const fetchListingsThumbnail = async ({
  queryKey,
  pageParam,
}): Promise<GetListingsResponse> => {
  const [_, initialParams] = queryKey
  const res = await axios
    .post('/api/listings', pageParam ?? initialParams)
    .catch(handleError)
  return res.data
}

export function useListingsThumbnail(searchParams: any) {
  return useInfiniteQuery<GetListingsResponse, Error>(
    ['listings', searchParams],
    fetchListingsThumbnail as any,
    {
      onError: (err) => alert(err),
      getNextPageParam: (lastPage) =>
        lastPage.searchParams.page ? lastPage.searchParams : null,
    }
  )
}

export const fetchListing = async (id: string): Promise<Listing> => {
  const res = await axios.get(`/api/listings/${id}`).catch(handleError)
  return res.data
}

export function useListing(id: string) {
  return useQuery<Listing, Error>('listing', () => fetchListing(id), {
    onError: (err) => alert(err),
  })
}

export const fetchSelectedListings = async (
  ids: string[]
): Promise<Listing[]> => {
  const res = await axios
    .post(`/api/listings/selected`, { ids })
    .catch(handleError)
  return res.data
}

export function useSelectedListings(ids: string[]) {
  return useQuery<Listing[], Error>(
    ['listings', ids],
    () => fetchSelectedListings(ids),
    {
      onError: (err) => alert(err),
    }
  )
}

export const handleError = (err) => {
  if (err.response) throw new Error(err.response.data.message)
  throw err
}

export const fetchGroup = async (id: string): Promise<Group> => {
  const res = await axios.get(`/api/groups/${id}`).catch(handleError)
  return res.data
}

export function useGroup(id: string) {
  return useQuery<Group, Error>(['group', id], () => fetchGroup(id), {
    enabled: !!id,
    onError: (err) => alert(err),
  })
}

const createGroup = async (partialGroup: Partial<Group>) => {
  const res = await axios
    .post('/api/groups/create', partialGroup)
    .catch(handleError)
  return res.data
}

export function useCreateGroup() {
  const client = useQueryClient()
  return useMutation<Group, Error, Partial<Group>>(createGroup, {
    onSuccess: () => client.invalidateQueries('groups'),
    onError: (err) => alert(err.message),
  })
}

const updateGroup = async (partialGroup: Partial<Group>) => {
  const res = await axios
    .put(`/api/groups/${partialGroup._id}`, partialGroup)
    .catch(handleError)
  return res.data
}

export function useUpdateGroup() {
  const client = useQueryClient()
  return useMutation<Group, Error, Partial<Group>>(updateGroup, {
    onSuccess: () => client.invalidateQueries('groups'),
    onError: (err) => alert(err.message),
  })
}

const deleteGroup = async (groupId: string) => {
  const res = await axios.delete(`/api/groups/${groupId}`).catch(handleError)
  return res.data
}

export function useDeleteGroup() {
  const client = useQueryClient()
  return useMutation<void, Error, string>(deleteGroup, {
    onSuccess: () => client.invalidateQueries('groups'),
    onError: (err) => alert(err.message),
  })
}

export const fetchGroups = async (): Promise<Group[]> => {
  const res = await axios.get(`/api/groups`).catch(handleError)
  return res.data
}

export function useUserGroups() {
  return useQuery<Group[], Error>('groups', fetchGroups, {
    onError: (err) => alert(err),
  })
}
