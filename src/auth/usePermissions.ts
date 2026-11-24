import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import { PROVIDER_ADMIN_ROLE } from '@/auth/roles'
import { hasPermission } from '@/auth/permissions'
import { getPrefixRoles, getProviderRoles } from '@/utils/getUserRoles'
import type { Permission, PermissionScope } from '@/auth/permissions'

export const usePermissions = () => {
  const { rolesReady, isSuperAdmin } = useAuth()
  const { data: profile } = useGetUserProfile()

  const isAllowed = (
    permission: Permission,
    { providerId, prefixId }: PermissionScope = {},
  ): boolean =>
    rolesReady &&
    hasPermission(permission, {
      isSuperAdmin,
      isProviderAdmin:
        providerId !== undefined &&
        getProviderRoles(profile, providerId).includes(PROVIDER_ADMIN_ROLE),
      prefixRoles: getPrefixRoles(profile, prefixId),
    })

  return { isAllowed, rolesReady }
}
