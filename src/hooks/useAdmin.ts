import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  fetchAllPrefixes,
  fetchRoleAssignmentMetadata,
  fetchRoleMetadata,
} from '@/api/admin'
import type { RoleAssignmentMetadata, RoleMetadata } from '@/types/admin'
import type { PrefixesResponse } from '@/types/prefixes'

export const useGetAllPrefixes = (
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
      return fetchAllPrefixes(
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
