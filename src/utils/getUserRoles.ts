import {
  PROVIDER_ADMIN_ROLE,
  PROVIDER_RESOURCE,
  SUPER_ADMIN_ROLE,
} from '@/auth/roles'
import type { UserProfile, UserRoles } from '@/types/profile'

// The memberships are grouped by resource type, for example
// { Provider: [{ name: '1', role: 'provider_admin' }] }.
const getUserRoles = (profile?: UserProfile): UserRoles => {
  const memberships = profile?.memberships ?? {}
  const hasRole = (group: string, role: string): boolean =>
    memberships[group]?.some((membership) => membership.role === role) ?? false

  return {
    roles: Array.from(
      new Set(
        Object.values(memberships).flatMap((entries) =>
          entries.map(({ role }) => role),
        ),
      ),
    ),
    isSuperAdmin: hasRole(SUPER_ADMIN_ROLE, SUPER_ADMIN_ROLE),
    isProviderAdmin: hasRole(PROVIDER_RESOURCE, PROVIDER_ADMIN_ROLE),
  }
}

export default getUserRoles
