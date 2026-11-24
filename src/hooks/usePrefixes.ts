import {
  useInfiniteQuery,
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

export const useGetProviderPrefixes = (
  providerId: number,
  size = 10,
  search?: string,
  provider?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useInfiniteQuery({
    queryKey: ['prefixes', 'pages', providerId, size, provider, search],
    queryFn: ({ pageParam }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      return fetchPrefixes(
        providerId,
        token,
        pageParam,
        size,
        undefined,
        provider,
        undefined,
        search,
      )
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PrefixesResponse) =>
      lastPage.number_of_page < lastPage.total_pages
        ? lastPage.number_of_page + 1
        : undefined,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[2] === providerId &&
      previousQuery.queryKey[4] === provider
        ? previousData
        : undefined,
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
      void queryClient.invalidateQueries({ queryKey: ['admin-prefixes'] })
      void queryClient.invalidateQueries({ queryKey: ['statistics'] })
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
      void queryClient.invalidateQueries({ queryKey: ['admin-prefixes'] })
      void queryClient.invalidateQueries({
        queryKey: ['prefix', providerId, id],
      })
      void queryClient.invalidateQueries({ queryKey: ['statistics'] })
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
      void queryClient.invalidateQueries({ queryKey: ['admin-prefixes'] })
      void queryClient.invalidateQueries({
        queryKey: ['prefix', providerId, id],
      })
      void queryClient.invalidateQueries({ queryKey: ['statistics'] })
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
      void queryClient.invalidateQueries({ queryKey: ['admin-prefixes'] })
      void queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
    onError: (error) => {
      console.error('Prefix delete error:', error)
    },
  })
}

export const useGetPrefixCount = (
  providerId: number,
  id: number,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-count', providerId, id],
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
      return fetchPrefixCount(providerId, id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!id,
  })
}

export const useGetPrefixResolvableCount = (
  providerId: number,
  id: number,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['prefix-resolvable-count', providerId, id],
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
      return fetchPrefixResolvableCount(providerId, id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!id,
  })
}

export const useGetPrefixStatistics = (
  providerId: number,
  id: number,
  enabled = true,
) => {
  const { token } = useAuth()
  return useQuery<PrefixStatistics, Error>({
    queryKey: ['prefix-statistics', providerId, id],
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
      return fetchPrefixStatistics(providerId, id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!id,
  })
}

export const useSetPrefixStatisticsMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    PrefixStatistics,
    Error,
    { providerId: number; id: number; data: PrefixStatisticsRequest }
  >({
    mutationFn: ({
      providerId,
      id,
      data,
    }: {
      providerId: number
      id: number
      data: PrefixStatisticsRequest
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
      return setPrefixStatistics(providerId, id, data, token)
    },
    onSuccess: (data, { providerId, id }) => {
      queryClient.setQueryData<PrefixStatistics>(
        ['prefix-statistics', providerId, id],
        data,
      )
      void queryClient.invalidateQueries({
        queryKey: ['prefix-statistics', providerId, id],
      })
    },
    onError: (error) => {
      console.error('Prefix statistics update error:', error)
    },
  })
}
