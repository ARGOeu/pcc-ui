import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import { Link, Navigate } from 'react-router-dom'
import Button from '@/components/Button'
import Card from '@/components/Card'

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

      <Card className="max-w-xl">
        <div className="flex flex-col gap-3 px-6 py-4">
          <div>
            <h2 className="section-title">Request a prefix for your project</h2>
            <p className="section-description">
              You need a prefix to create handles. Send a request with your
              organisation and project details and an administrator will review
              it and assign a provider to it. Follow its status under{' '}
              <Link
                to="/requests"
                className="font-medium text-brand underline hover:text-brand-strong"
              >
                My requests
              </Link>
              .
            </p>
          </div>
          <div>
            <Button href="/requests/add">Request a prefix</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Home
