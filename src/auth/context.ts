import { createContext } from 'react'
import type { UserRoles } from '@/types/profile'

export interface AuthContextType extends UserRoles {
  initialized: boolean
  authenticated: boolean
  registered: boolean
  rolesReady: boolean
  token?: string
  login: (redirectUri?: string) => void
  logout: (redirectUri?: string) => void
}

export const AuthContext = createContext<AuthContextType>({
  initialized: false,
  authenticated: false,
  registered: false,
  rolesReady: false,
  roles: [],
  isSuperAdmin: false,
  isProviderAdmin: false,
  token: undefined,
  login: () => {
    console.warn('AuthContext: login() called outside of AuthProvider')
  },
  logout: () => {
    console.warn('AuthContext: logout() called outside of AuthProvider')
  },
})
