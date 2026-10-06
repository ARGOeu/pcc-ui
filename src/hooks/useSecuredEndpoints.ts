import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  assignEndpointsToRole,
  fetchAllRoleAssignedEndpoints,
  fetchRoleAssignedEndpoints,
  fetchSecuredEndpoints,
} from '@/api/securedEndpoints'
import type {
  AssignEndpointsToRoleRequest,
  RoleAssignedEndpointsResponse,
  SecuredEndpoint,
} from '@/types/securedEndpoints'

export const useGetSecuredEndpoints = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<SecuredEndpoint[], Error>({
    queryKey: ['secured-endpoints'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchSecuredEndpoints(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetAllRoleAssignedEndpoints = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleAssignedEndpointsResponse, Error>({
    queryKey: ['role-assigned-endpoints', 'all'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchAllRoleAssignedEndpoints(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetRoleAssignedEndpoints = (roleId: string, enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleAssignedEndpointsResponse, Error>({
    queryKey: ['role-assigned-endpoints', roleId],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!roleId) {
        throw new Error('Role ID is required')
      }
      return fetchRoleAssignedEndpoints(roleId, token)
    },
    retry: false,
    enabled: enabled && !!token && !!roleId,
  })
}

export const useAssignEndpointsToRoleMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    void,
    Error,
    { roleId: string; data: AssignEndpointsToRoleRequest }
  >({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: string
      data: AssignEndpointsToRoleRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!roleId) {
        throw new Error('Role ID is required')
      }
      return assignEndpointsToRole(roleId, data, token)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['role-assigned-endpoints'],
      }),
    onError: (error) => {
      console.error('Assign endpoints to role error:', error)
    },
  })
}
