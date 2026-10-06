import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { fetchRoleAssignmentMetadata, fetchRoleMetadata } from '@/api/admin'
import type { RoleAssignmentMetadata, RoleMetadata } from '@/types/admin'

export const useGetRoleMetadata = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleMetadata, Error>({
    queryKey: ['role-metadata'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchRoleMetadata(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}

export const useGetRoleAssignmentMetadata = (enabled = true) => {
  const { token } = useAuth()

  return useQuery<RoleAssignmentMetadata, Error>({
    queryKey: ['role-assignment-metadata'],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      return fetchRoleAssignmentMetadata(token)
    },
    retry: false,
    enabled: enabled && !!token,
  })
}
