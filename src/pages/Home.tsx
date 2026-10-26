import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const { data: profile } = useGetUserProfile()
  const { rolesReady, isSuperAdmin, isProviderAdmin } = useAuth()

  if (!rolesReady) {
    return null
  }

  if (isSuperAdmin || isProviderAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Welcome to the PID Central Catalogue
        {profile?.name && (
          <span>
            , <span className="text-brand">{profile.name}</span>!
          </span>
        )}
      </h1>
      <p className="text-muted mb-6">
        A central catalogue for registering and discovering persistent
        identifiers
      </p>
    </div>
  )
}

export default Home
