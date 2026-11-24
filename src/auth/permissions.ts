import { PREFIX_ADMIN_ROLE, PREFIX_MEMBER_ROLE } from '@/auth/roles'

export type Permission =
  | 'provider.create'
  | 'provider.edit'
  | 'provider.delete'
  | 'provider.invite'
  | 'prefix.create'
  | 'prefix.edit'
  | 'prefix.delete'
  | 'prefix.invite'
  | 'prefix.statistics'
  | 'account.manage'
  | 'handle.create'
  | 'handle.edit'
  | 'handle.delete'

type RoleLevel = 'providerAdmin' | 'prefixAdmin' | 'prefixMember'

export interface PermissionScope {
  providerId?: number
  prefixId?: number
}

export const permissionPolicy: Record<Permission, RoleLevel[]> = {
  'provider.create': [],
  'provider.edit': ['providerAdmin'],
  'provider.delete': [],
  'provider.invite': ['providerAdmin'],
  'prefix.create': ['providerAdmin'],
  'prefix.edit': ['providerAdmin', 'prefixAdmin'],
  'prefix.delete': ['providerAdmin'],
  'prefix.invite': ['providerAdmin', 'prefixAdmin'],
  'prefix.statistics': ['providerAdmin', 'prefixAdmin'],
  'account.manage': ['providerAdmin', 'prefixAdmin'],
  'handle.create': ['providerAdmin', 'prefixAdmin', 'prefixMember'],
  'handle.edit': ['providerAdmin', 'prefixAdmin', 'prefixMember'],
  'handle.delete': ['providerAdmin', 'prefixAdmin'],
}

interface PermissionSubject {
  isSuperAdmin: boolean
  isProviderAdmin: boolean
  prefixRoles: string[]
}

export const hasPermission = (
  permission: Permission,
  { isSuperAdmin, isProviderAdmin, prefixRoles }: PermissionSubject,
): boolean => {
  if (isSuperAdmin) {
    return true
  }

  const levels: RoleLevel[] = []
  if (isProviderAdmin) {
    levels.push('providerAdmin')
  }
  if (prefixRoles.includes(PREFIX_ADMIN_ROLE)) {
    levels.push('prefixAdmin')
  }
  if (prefixRoles.includes(PREFIX_MEMBER_ROLE)) {
    levels.push('prefixMember')
  }

  return permissionPolicy[permission].some((level) => levels.includes(level))
}
