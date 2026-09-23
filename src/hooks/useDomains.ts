import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchDomains } from '@/api/domains'
import type { Domain } from '@/types/domains'

export const useGetDomains = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<Domain[], Error>({
    queryKey: ['domains'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchDomains(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
