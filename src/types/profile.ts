import type { RoleAttributes } from '@/types/roles'

export interface Membership {
  name: string
  role: string
  attributes?: RoleAttributes
}

export interface UserProfile {
  id: string
  username?: string
  email?: string
  name?: string
  surname?: string
  memberships?: Record<string, Membership[]>
}

export interface UserRoles {
  roles: string[]
  isSuperAdmin: boolean
  isProviderAdmin: boolean
}

export interface RegistrationResponse {
  code?: number
  message?: string
  errors?: string[]
}
