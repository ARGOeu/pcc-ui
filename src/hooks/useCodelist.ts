import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchCodelist } from '@/api/codelist'
import type { CodelistItem } from '@/types/codelist'

export const useGetContractTypes = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<CodelistItem[], Error>({
    queryKey: ['codelist', 'contract_type'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchCodelist('contract_type', token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetLookupServiceTypes = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<CodelistItem[], Error>({
    queryKey: ['codelist', 'lookup_service_type'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchCodelist('lookup_service_type', token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
