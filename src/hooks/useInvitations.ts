import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createInvitation,
  fetchInvitation,
  fetchInvitations,
  fetchUserInvitation,
  fetchUserInvitations,
  respondToInvitation,
  revokeInvitation,
} from '@/api/invitations'
import type {
  CreateInvitationRequest,
  Invitation,
  InvitationSortField,
  InvitationsResponse,
  RespondToInvitationVariables,
  SortOrder,
} from '@/types/invitations'

export const useGetUserInvitations = (
  page = 1,
  size = 10,
  enabled = true,
  options?: { refetchInterval?: number; staleTime?: number },
) => {
  const { token } = useAuth()

  return useQuery<InvitationsResponse, Error>({
    queryKey: ['user-invitations', 'list', page, size],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchUserInvitations(token, page, size)
    },
    retry: false,
    enabled: enabled && !!token,
    refetchOnMount: 'always',
    ...options,
  })
}

export const useGetUserInvitation = (invitationId: string, enabled = true) => {
  const { token } = useAuth()

  return useQuery<Invitation, Error>({
    queryKey: ['user-invitations', 'detail', invitationId],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return fetchUserInvitation(invitationId, token)
    },
    retry: false,
    enabled: enabled && !!token && !!invitationId,
  })
}

export const useRespondToInvitationMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Invitation, Error, RespondToInvitationVariables>({
    mutationFn: ({ invitationId, action }: RespondToInvitationVariables) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return respondToInvitation(invitationId, { action }, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user-invitations'] })
      void queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error) => {
      console.error('Invitation response error:', error)
    },
  })
}

export const useGetInvitations = (
  page = 1,
  size = 10,
  apiResource?: string,
  resourceId?: string,
  search?: string,
  sort?: InvitationSortField,
  order?: SortOrder,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<InvitationsResponse, Error>({
    queryKey: [
      'invitations',
      'list',
      apiResource,
      resourceId,
      page,
      size,
      search,
      sort,
      order,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchInvitations(
        token,
        page,
        size,
        apiResource,
        resourceId,
        search,
        sort,
        order,
      )
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetInvitation = (invitationId: string, enabled = true) => {
  const { token } = useAuth()

  return useQuery<Invitation, Error>({
    queryKey: ['invitations', 'detail', invitationId],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return fetchInvitation(invitationId, token)
    },
    retry: false,
    enabled: enabled && !!token && !!invitationId,
  })
}

export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Invitation, Error, CreateInvitationRequest>({
    mutationFn: (data: CreateInvitationRequest) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!data.api_resource) {
        throw new Error('API resource is required')
      }
      if (!data.resource_id) {
        throw new Error('Resource ID is required')
      }
      return createInvitation(data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['invitations'] })
      void queryClient.invalidateQueries({ queryKey: ['user-invitations'] })
    },
    onError: (error) => {
      console.error('Invitation create error:', error)
    },
  })
}

export const useRevokeInvitationMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<Invitation, Error, { invitationId: string }>({
    mutationFn: ({ invitationId }: { invitationId: string }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return revokeInvitation(invitationId, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['invitations'] })
      void queryClient.invalidateQueries({ queryKey: ['user-invitations'] })
    },
    onError: (error) => {
      console.error('Invitation revoke error:', error)
    },
  })
}
