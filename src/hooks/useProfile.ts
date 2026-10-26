import { queryOptions, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchUserProfile } from '@/api/profile'
import type { UserProfile } from '@/types/profile'

export const userProfileQueryOptions = (
  token: string | undefined,
  enabled = true,
) =>
  queryOptions<UserProfile, Error>({
    queryKey: ['user-profile'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchUserProfile(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })

export const useGetUserProfile = (enabled = true) => {
  const { token } = useAuth()

  return useQuery(userProfileQueryOptions(token, enabled))
}
