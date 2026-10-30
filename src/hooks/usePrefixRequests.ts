import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  assignPrefixRequestProvider,
  createPrefixRequest,
  deletePrefixRequest,
  fetchPrefixRequest,
  fetchPrefixRequests,
  fetchProviderPrefixRequests,
  updatePrefixRequest,
  updatePrefixRequestStatus,
} from '@/api/prefixRequests'
import type {
  PrefixRequest,
  PrefixRequestReviewPayload,
  PrefixRequestPayload,
} from '@/types/prefixRequests'

export const useGetPrefixRequests = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<PrefixRequest[], Error>({
    queryKey: ['prefix-requests', 'list'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchPrefixRequests(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetProviderPrefixRequests = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<PrefixRequest[], Error>({
    queryKey: ['prefix-requests', 'by-provider'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchProviderPrefixRequests(token)
    },
    retry: false,
    enabled: enabled && !!token,
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
