import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { createRole, fetchRoles, updateRoleAttributes } from '@/api/roles'
import type { CreateRoleRequest, Role, RoleAttributes } from '@/types/roles'

export const useGetRoles = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchRoles(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, CreateRoleRequest>({
    mutationFn: (data: CreateRoleRequest) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return createRole(data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      console.error('Role create error:', error)
    },
  })
}

export const useUpdateRoleAttributesMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<void, Error, { id: string; data: RoleAttributes }>({
    mutationFn: ({ id, data }: { id: string; data: RoleAttributes }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!id) {
        throw new Error('Role ID is required')
      }
      return updateRoleAttributes(id, data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      console.error('Role attributes update error:', error)
    },
  })
}
