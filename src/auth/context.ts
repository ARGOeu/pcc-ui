import { createContext } from 'react'

export interface AuthContextType {
  initialized: boolean
  authenticated: boolean
  registered: boolean
  token?: string
  login: (redirectUri?: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  initialized: false,
  authenticated: false,
  registered: false,
  token: undefined,
  login: () => {
    console.warn('AuthContext: login() called outside of AuthProvider')
  },
  logout: () => {
    console.warn('AuthContext: logout() called outside of AuthProvider')
  },
})
