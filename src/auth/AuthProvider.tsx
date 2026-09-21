import { useEffect, useRef, useState } from 'react'
import { AuthContext } from './context'
import { keycloak, initKeycloak } from './keycloak'
import { registerUser } from '@/api/profile'
import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [token, setToken] = useState<string | undefined>(undefined)

  const startedRef = useRef(false)
  const refreshTimerRef = useRef<number | null>(null)
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    initKeycloak({
      onLoad: 'check-sso',
      scope: import.meta.env.VITE_KEYCLOAK_SCOPE,
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
      .then(async (auth) => {
        setAuthenticated(auth)

        if (auth) {
          setToken(keycloak.token)

          // Register user once when authenticated
          if (!hasRegistered.current && keycloak.token) {
            hasRegistered.current = true
            try {
              await registerUser(keycloak.token)
              setRegistered(true)
            } catch (error) {
              console.error('User registration error:', error)
              // Set registered to true even if registration fails to not block the app
              setRegistered(true)
            }
          } else {
            setRegistered(true)
          }

          // Refresh token every 1 min; keep at least 2 mins of validity.
          refreshTimerRef.current = window.setInterval(async () => {
            try {
              const refreshed = await keycloak.updateToken(2 * 60) // Refresh if token will expire in the next 2 mins
              if (refreshed) setToken(keycloak.token)
            } catch {
              setAuthenticated(false)
              setToken(undefined)
              void keycloak.login({
                redirectUri:
                  import.meta.env.VITE_REDIRECT_URI ?? window.location.origin,
              })
            }
          }, 60000)
        }

        setInitialized(true)
      })
      .catch((e) => {
        console.error('Keycloak init failed', e)
        setInitialized(true) // let the app render a logged-out state
      })

    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearInterval(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [])

  const login = (redirectUri?: string) => {
    void keycloak.login({
      redirectUri:
        redirectUri ??
        import.meta.env.VITE_REDIRECT_URI ??
        window.location.origin,
    })
  }

  const logout = () => {
    void keycloak.logout({
      redirectUri: import.meta.env.VITE_REDIRECT_URI ?? window.location.origin,
    })
  }

  return (
    <AuthContext
      value={{
        initialized,
        authenticated,
        registered,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  )
}
