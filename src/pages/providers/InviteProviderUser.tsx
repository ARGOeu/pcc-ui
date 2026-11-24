import { useGetProvider } from '@/hooks/useProviders'
import { PROVIDER_RESOURCE } from '@/auth/roles'
import { usePermissions } from '@/auth/usePermissions'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import InviteUserForm from '@/components/InviteUserForm'

const providersPath = '/providers'

const InviteProviderUser = () => {
  const { providerId: providerIdParam } = useParams<{ providerId: string }>()
  const providerId = Number(providerIdParam)
  const navigate = useNavigate()

  const { isAllowed, rolesReady } = usePermissions()
  const canInvite = isAllowed('provider.invite', { providerId })
  const {
    data: provider,
    isLoading: isProviderLoading,
    error: providerError,
  } = useGetProvider(providerId, !!providerIdParam && canInvite)

  if (!rolesReady) {
    return null
  }

  if (!canInvite) {
    return <Navigate to={providersPath} replace />
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Invite user"
        subtitle={
          <>
            Invite a user by email and give them a role on provider{' '}
            {provider?.name && <strong>{provider.name}</strong>}
          </>
        }
        navigateTo={{ label: 'Back to providers', to: providersPath }}
        className="mb-6"
      />

      {isProviderLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : providerError ? (
        <ErrorDisplay error={providerError} context="provider" />
      ) : (
        <InviteUserForm
          apiResource={PROVIDER_RESOURCE}
          resourceId={String(providerId)}
          cancelTo={providersPath}
          onInvited={() => void navigate(providersPath)}
        />
      )}
    </div>
  )
}

export default InviteProviderUser
