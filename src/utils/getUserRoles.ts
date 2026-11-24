import {
  PREFIX_ADMIN_ROLE,
  PREFIX_MEMBER_ROLE,
  PREFIX_RESOURCE,
  PROVIDER_ADMIN_ROLE,
  PROVIDER_RESOURCE,
  SUPER_ADMIN_ROLE,
} from '@/auth/roles'
import type { UserProfile, UserRoles } from '@/types/profile'

export const getPrefixRoles = (
  profile?: UserProfile,
  prefixId?: number,
): string[] =>
  (profile?.memberships?.[PREFIX_RESOURCE] ?? [])
    .filter(
      (membership) =>
        prefixId === undefined || membership.name === String(prefixId),
    )
    .map(({ role }) => role)

export const getProviderRoles = (
  profile: UserProfile | undefined,
  providerId: number,
): string[] =>
  (profile?.memberships?.[PROVIDER_RESOURCE] ?? [])
    .filter((membership) => membership.name === String(providerId))
    .map(({ role }) => role)

// The memberships are grouped by resource type, for example
// { Provider: [{ name: '1', role: 'provider_admin' }] }.
const getUserRoles = (profile?: UserProfile): UserRoles => {
  const memberships = profile?.memberships ?? {}
  const hasRole = (group: string, role: string): boolean =>
    memberships[group]?.some((membership) => membership.role === role) ?? false
  const prefixRoles = getPrefixRoles(profile)

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
    isPrefixAdmin: prefixRoles.includes(PREFIX_ADMIN_ROLE),
    isPrefixMember: prefixRoles.includes(PREFIX_MEMBER_ROLE),
  }
}

export default getUserRoles
