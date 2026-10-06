import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createPrefixInvitation,
  fetchPrefixInvitation,
  fetchPrefixInvitations,
  fetchUserInvitation,
  fetchUserInvitations,
  respondToInvitation,
  revokePrefixInvitation,
} from '@/api/invitations'
import type {
  CreatePrefixInvitationRequest,
  Invitation,
  InvitationsResponse,
  RespondToInvitationVariables,
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
    mutationFn: ({ invitation, action }: RespondToInvitationVariables) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return respondToInvitation(
        invitation.id,
        {
          action,
          api_resource: 'Prefix',
          resource_id: Number(invitation.prefix_id),
          role: invitation.role,
        },
        token,
      )
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

export const useGetPrefixInvitations = (
  providerId: number,
  prefixId: number,
  page = 1,
  size = 10,
  search?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<InvitationsResponse, Error>({
    queryKey: [
      'prefix-invitations',
      providerId,
      prefixId,
      'list',
      page,
      size,
      search,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      return fetchPrefixInvitations(
        providerId,
        prefixId,
        token,
        page,
        size,
        search,
      )
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!prefixId,
  })
}

export const useGetPrefixInvitation = (
  providerId: number,
  prefixId: number,
  invitationId: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<Invitation, Error>({
    queryKey: [
      'prefix-invitations',
      providerId,
      prefixId,
      'detail',
      invitationId,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return fetchPrefixInvitation(providerId, prefixId, invitationId, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!prefixId && !!invitationId,
  })
}

export const useCreatePrefixInvitationMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Invitation,
    Error,
    {
      providerId: number
      prefixId: number
      data: CreatePrefixInvitationRequest
    }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      data,
    }: {
      providerId: number
      prefixId: number
      data: CreatePrefixInvitationRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      return createPrefixInvitation(providerId, prefixId, data, token)
    },
    onSuccess: (_, { providerId, prefixId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['prefix-invitations', providerId, prefixId],
      })
      void queryClient.invalidateQueries({ queryKey: ['user-invitations'] })
    },
    onError: (error) => {
      console.error('Prefix invitation create error:', error)
    },
  })
}

export const useRevokePrefixInvitationMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Invitation,
    Error,
    { providerId: number; prefixId: number; invitationId: string }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      invitationId,
    }: {
      providerId: number
      prefixId: number
      invitationId: string
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!invitationId) {
        throw new Error('Invitation ID is required')
      }
      return revokePrefixInvitation(providerId, prefixId, invitationId, token)
    },
    onSuccess: (_, { providerId, prefixId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['prefix-invitations', providerId, prefixId],
      })
      void queryClient.invalidateQueries({ queryKey: ['user-invitations'] })
    },
    onError: (error) => {
      console.error('Prefix invitation revoke error:', error)
    },
  })
}
