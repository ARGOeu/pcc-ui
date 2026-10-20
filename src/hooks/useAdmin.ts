import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  fetchPrefixes,
  fetchRoleAssignmentMetadata,
  fetchRoleMetadata,
} from '@/api/admin'
import type { RoleAssignmentMetadata, RoleMetadata } from '@/types/admin'
import type { PrefixesResponse } from '@/types/prefixes'

export const useGetAdminPrefixes = (
  page = 1,
  size = 10,
  domain?: string,
  provider?: string,
  contractType?: string,
  search?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<PrefixesResponse, Error>({
    queryKey: [
      'admin-prefixes',
      page,
      size,
      domain,
      provider,
      contractType,
      search,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchPrefixes(
        token,
        page,
        size,
        domain,
        provider,
        contractType,
        search,
      )
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetAllPrefixes = (
  size = 10,
  search?: string,
  provider?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useInfiniteQuery({
    queryKey: ['admin-prefixes', 'pages', size, provider, search],
    queryFn: ({ pageParam }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchPrefixes(
        token,
        pageParam,
        size,
        undefined,
        provider,
        undefined,
        search,
      )
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PrefixesResponse) =>
      lastPage.number_of_page < lastPage.total_pages
        ? lastPage.number_of_page + 1
        : undefined,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[3] === provider ? previousData : undefined,
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetRoleMetadata = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleMetadata, Error>({
    queryKey: ['role-metadata'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchRoleMetadata(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetRoleAssignmentMetadata = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleAssignmentMetadata, Error>({
    queryKey: ['role-assignment-metadata'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchRoleAssignmentMetadata(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
