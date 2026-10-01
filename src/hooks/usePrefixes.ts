import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createPrefix,
  deletePrefix,
  fetchPrefix,
  fetchPrefixCount,
  fetchPrefixResolvableCount,
  fetchPrefixStatistics,
  fetchPrefixes,
  patchPrefix,
  setPrefixStatistics,
  updatePrefix,
} from '@/api/prefixes'
import type {
  Prefix,
  PrefixPartialRequest,
  PrefixRequest,
  PrefixStatistics,
  PrefixStatisticsRequest,
  PrefixesResponse,
} from '@/types/prefixes'

export const useGetPrefixes = (
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
    queryKey: ['prefixes', page, size, domain, provider, contractType, search],
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

export const useGetPrefix = (id: number, enabled = true) => {
  const { token } = useAuth()

  return useQuery<Prefix, Error>({
    queryKey: ['prefix', id],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return fetchPrefix(id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!id,
  })
}

export const useCreatePrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Prefix, Error, PrefixRequest>({
    mutationFn: (data: PrefixRequest) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return createPrefix(data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
    },
    onError: (error) => {
      console.error('Prefix create error:', error)
    },
  })
}

export const useUpdatePrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Prefix, Error, { id: number; data: PrefixRequest }>({
    mutationFn: ({ id, data }: { id: number; data: PrefixRequest }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return updatePrefix(id, data, token)
    },
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
      void queryClient.invalidateQueries({ queryKey: ['prefix', id] })
    },
    onError: (error) => {
      console.error('Prefix update error:', error)
    },
  })
}

export const usePatchPrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Prefix, Error, { id: number; data: PrefixPartialRequest }>(
    {
      mutationFn: ({
        id,
        data,
      }: {
        id: number
        data: PrefixPartialRequest
      }) => {
        if (!token) {
          throw new Error('No authentication token available')
        }
        if (!id) {
          throw new Error('Prefix ID is required')
        }
        return patchPrefix(id, data, token)
      },
      onSuccess: (_, { id }) => {
        void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
        void queryClient.invalidateQueries({ queryKey: ['prefix', id] })
      },
      onError: (error) => {
        console.error('Prefix patch error:', error)
      },
    },
  )
}

export const useDeletePrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, { id: number }>({
    mutationFn: ({ id }: { id: number }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return deletePrefix(id, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
    },
    onError: (error) => {
      console.error('Prefix delete error:', error)
    },
  })
}

export const useGetPrefixCount = (name: string, enabled = true) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-count', name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixCount(name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!name,
  })
}

export const useGetPrefixResolvableCount = (name: string, enabled = true) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-resolvable-count', name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixResolvableCount(name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!name,
  })
}

export const useGetPrefixStatistics = (name: string, enabled = true) => {
  const { token } = useAuth()
  return useQuery<PrefixStatistics, Error>({
    queryKey: ['prefix-statistics', name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixStatistics(name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!name,
  })
}

export const useSetPrefixStatisticsMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    PrefixStatistics,
    Error,
    { name: string; data: PrefixStatisticsRequest }
  >({
    mutationFn: ({
      name,
      data,
    }: {
      name: string
      data: PrefixStatisticsRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return setPrefixStatistics(name, data, token)
    },
    onSuccess: (_, { name }) => {
      void queryClient.invalidateQueries({
        queryKey: ['prefix-statistics', name],
      })
    },
    onError: (error) => {
      console.error('Prefix statistics update error:', error)
    },
  })
}
