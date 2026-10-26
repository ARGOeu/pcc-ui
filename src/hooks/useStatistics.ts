import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchAdminStatistics, fetchProviderStatistics } from '@/api/statistics'
import type { StatisticsResponse } from '@/types/statistics'

export const useGetAdminStatistics = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<StatisticsResponse, Error>({
    queryKey: ['statistics', 'admin'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchAdminStatistics(token)
    },
    retry: false,
    refetchOnMount: 'always',
    enabled: enabled && !!token,
  })
}

export const useGetProviderStatistics = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<StatisticsResponse, Error>({
    queryKey: ['statistics', 'provider'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchProviderStatistics(token)
    },
    retry: false,
    refetchOnMount: 'always',
    enabled: enabled && !!token,
  })
}
