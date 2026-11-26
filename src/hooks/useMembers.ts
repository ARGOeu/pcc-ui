import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchMembers } from '@/api/members'
import type { MembersResponse } from '@/types/members'

export const useGetMembers = (
  page = 1,
  size = 10,
  resource?: string,
  search?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<MembersResponse, Error>({
    queryKey: ['members', page, size, resource, search],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchMembers(token, page, size, resource, search)
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: enabled && !!token,
  })
}
