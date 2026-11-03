import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  assignPrefixRequestProvider,
  createPrefixRequest,
  deletePrefixRequest,
  fetchPrefixRequest,
  fetchPrefixRequests,
  fetchProviderPrefixRequest,
  fetchProviderPrefixRequests,
  updatePrefixRequest,
  updatePrefixRequestStatus,
} from '@/api/prefixRequests'
import type {
  PrefixRequest,
  PrefixRequestReviewPayload,
  PrefixRequestPayload,
  PrefixRequestStatus,
  PrefixRequestsResponse,
} from '@/types/prefixRequests'

export const useGetPrefixRequests = (
  page = 1,
  size = 10,
  search?: string,
  status?: PrefixRequestStatus,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<PrefixRequestsResponse, Error>({
    queryKey: ['prefix-requests', 'list', status, page, size, search],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchPrefixRequests(token, page, size, search, status)
    },
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[2] === status ? previousData : undefined,
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetPendingRequestsCount = (enabled = true): number => {
  const { data } = useGetPrefixRequests(1, 1, undefined, 'PENDING', enabled)

  return data?.total_elements ?? 0
}

export const useGetProviderPrefixRequests = (
  page = 1,
  size = 10,
  search?: string,
  status?: PrefixRequestStatus,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<PrefixRequestsResponse, Error>({
    queryKey: ['prefix-requests', 'by-provider', status, page, size, search],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchProviderPrefixRequests(token, page, size, search, status)
    },
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[2] === status ? previousData : undefined,
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetProviderPrefixRequest = (id: number, enabled = true) => {
  const { token } = useAuth()

  return useQuery<PrefixRequest, Error>({
    queryKey: ['prefix-requests', 'provider-detail', id],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      return fetchProviderPrefixRequest(id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!id,
  })
}

export const useGetPrefixRequest = (id: number, enabled = true) => {
  const { token } = useAuth()

  return useQuery<PrefixRequest, Error>({
    queryKey: ['prefix-requests', 'detail', id],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      return fetchPrefixRequest(id, token)
    },
    retry: false,
    enabled: enabled && !!token && !!id,
  })
}

export const useCreatePrefixRequestMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<PrefixRequest, Error, PrefixRequestPayload>({
    mutationFn: (data: PrefixRequestPayload) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return createPrefixRequest(data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefix-requests'] })
    },
    onError: (error) => {
      console.error('Prefix request create error:', error)
    },
  })
}

export const useUpdatePrefixRequestMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    PrefixRequest,
    Error,
    { id: number; data: PrefixRequestPayload }
  >({
    mutationFn: ({ id, data }: { id: number; data: PrefixRequestPayload }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      return updatePrefixRequest(id, data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefix-requests'] })
    },
    onError: (error) => {
      console.error('Prefix request update error:', error)
    },
  })
}

export const useDeletePrefixRequestMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      return deletePrefixRequest(id, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefix-requests'] })
    },
    onError: (error) => {
      console.error('Prefix request delete error:', error)
    },
  })
}

export const useUpdateRequestStatusMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    PrefixRequest,
    Error,
    { id: number; data: PrefixRequestReviewPayload }
  >({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: PrefixRequestReviewPayload
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      return updatePrefixRequestStatus(id, data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefix-requests'] })
    },
    onError: (error) => {
      console.error('Prefix request status error:', error)
    },
  })
}

export const useAssignRequestProviderMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<PrefixRequest, Error, { id: number; providerId: number }>({
    mutationFn: ({ id, providerId }: { id: number; providerId: number }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Request ID is required')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      return assignPrefixRequestProvider(id, providerId, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prefix-requests'] })
    },
    onError: (error) => {
      console.error('Prefix request provider error:', error)
    },
  })
}
