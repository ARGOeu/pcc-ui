export const SUPER_ADMIN_ROLE = 'super_admin'
export const PROVIDER_ADMIN_ROLE = 'provider_admin'
export const PREFIX_ADMIN_ROLE = 'prefix_admin'
export const PREFIX_MEMBER_ROLE = 'prefix_member'

// The profile memberships are grouped by resource type
export const PROVIDER_RESOURCE = 'Provider'
export const PREFIX_RESOURCE = 'Prefix'

export const INVITABLE_ROLES: Partial<Record<string, string[]>> = {
  [PROVIDER_RESOURCE]: [PROVIDER_ADMIN_ROLE],
  [PREFIX_RESOURCE]: [PREFIX_ADMIN_ROLE, PREFIX_MEMBER_ROLE],
}
