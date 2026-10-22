import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createProvider,
  deleteProvider,
  fetchProvider,
  fetchProviders,
  updateProvider,
} from '@/api/providers'
import type { Provider, ProviderRequest } from '@/types/providers'

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

export const useGetProvider = (id: number, enabled = true) => {
  const { token } = useAuth()

  return useQuery<Provider, Error>({
    queryKey: ['provider', id],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Provider ID is required')
      }
      return fetchProvider(id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!id,
  })
}

export const useCreateProviderMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Provider, Error, { data: ProviderRequest }>({
    mutationFn: ({ data }: { data: ProviderRequest }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return createProvider(data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['providers'] })
    },
    onError: (error) => {
      console.error('Provider create error:', error)
    },
  })
}

export const useUpdateProviderMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Provider, Error, { id: number; data: ProviderRequest }>({
    mutationFn: ({ id, data }: { id: number; data: ProviderRequest }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Provider ID is required')
      }
      return updateProvider(id, data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['providers'] })
      void queryClient.invalidateQueries({ queryKey: ['provider'] })
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-prefixes'] })
    },
    onError: (error) => {
      console.error('Provider update error:', error)
    },
  })
}

export const useDeleteProviderMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, { id: number }>({
    mutationFn: ({ id }: { id: number }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Provider ID is required')
      }
      return deleteProvider(id, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['providers'] })
    },
    onError: (error) => {
      console.error('Provider delete error:', error)
    },
  })
}
