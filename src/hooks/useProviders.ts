import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchProviders } from '@/api/providers'
import type { Provider } from '@/types/providers'

export const useGetProviders = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<Provider[], Error>({
    queryKey: ['providers'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchProviders(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
