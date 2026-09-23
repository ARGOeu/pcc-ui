import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchServices } from '@/api/services'
import type { Service } from '@/types/services'

export const useGetServices = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchServices(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
