import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  providerId: number,
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
      'prefixes',
      providerId,
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
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      return fetchPrefixes(
        providerId,
        token,
        page,
        size,
        domain,
        provider,
        contractType,
        search,
      )
    },
    // Keep the old rows while a new page or filter loads, but not when the provider changes.
    // This relies on the provider id staying the second item in the query key.
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === providerId ? previousData : undefined,
    retry: false,
    enabled: enabled && !!token && !!providerId,
  })
}

export const useGetPrefix = (
  providerId: number,
  id: number,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<Prefix, Error>({
    queryKey: ['prefix', providerId, id],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return fetchPrefix(providerId, id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!id,
  })
}

export const useCreatePrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Prefix,
    Error,
    { providerId: number; data: PrefixRequest }
  >({
    mutationFn: ({
      providerId,
      data,
    }: {
      providerId: number
      data: PrefixRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      return createPrefix(providerId, data, token)
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

  return useMutation<
    Prefix,
    Error,
    { providerId: number; id: number; data: PrefixRequest }
  >({
    mutationFn: ({
      providerId,
      id,
      data,
    }: {
      providerId: number
      id: number
      data: PrefixRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return updatePrefix(providerId, id, data, token)
    },
    onSuccess: (_, { providerId, id }) => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
      void queryClient.invalidateQueries({
        queryKey: ['prefix', providerId, id],
      })
    },
    onError: (error) => {
      console.error('Prefix update error:', error)
    },
  })
}

export const usePatchPrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Prefix,
    Error,
    { providerId: number; id: number; data: PrefixPartialRequest }
  >({
    mutationFn: ({
      providerId,
      id,
      data,
    }: {
      providerId: number
      id: number
      data: PrefixPartialRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return patchPrefix(providerId, id, data, token)
    },
    onSuccess: (_, { providerId, id }) => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
      void queryClient.invalidateQueries({
        queryKey: ['prefix', providerId, id],
      })
    },
    onError: (error) => {
      console.error('Prefix patch error:', error)
    },
  })
}

export const useDeletePrefixMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, { providerId: number; id: number }>({
    mutationFn: ({ providerId, id }: { providerId: number; id: number }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!id) {
        throw new Error('Prefix ID is required')
      }
      return deletePrefix(providerId, id, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefixes'] })
    },
    onError: (error) => {
      console.error('Prefix delete error:', error)
    },
  })
}

export const useGetPrefixCount = (
  providerId: number,
  name: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-count', providerId, name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixCount(providerId, name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!name,
  })
}

export const useGetPrefixResolvableCount = (
  providerId: number,
  name: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-resolvable-count', providerId, name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixResolvableCount(providerId, name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!name,
  })
}

export const useGetPrefixStatistics = (
  providerId: number,
  name: string,
  enabled = true,
) => {
  const { token } = useAuth()
  return useQuery<PrefixStatistics, Error>({
    queryKey: ['prefix-statistics', providerId, name],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return fetchPrefixStatistics(providerId, name, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!name,
  })
}

export const useSetPrefixStatisticsMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    PrefixStatistics,
    Error,
    { providerId: number; name: string; data: PrefixStatisticsRequest }
  >({
    mutationFn: ({
      providerId,
      name,
      data,
    }: {
      providerId: number
      name: string
      data: PrefixStatisticsRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!name) {
        throw new Error('Prefix name is required')
      }
      return setPrefixStatistics(providerId, name, data, token)
    },
    onSuccess: (_, { providerId, name }) => {
      void queryClient.invalidateQueries({
        queryKey: ['prefix-statistics', providerId, name],
      })
    },
    onError: (error) => {
      console.error('Prefix statistics update error:', error)
    },
  })
}
