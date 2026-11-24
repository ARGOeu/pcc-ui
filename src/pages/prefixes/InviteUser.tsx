import { useGetPrefix } from '@/hooks/usePrefixes'
import { PREFIX_RESOURCE } from '@/auth/roles'
import { usePermissions } from '@/auth/usePermissions'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import InviteUserForm from '@/components/InviteUserForm'

const InviteUser = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const detailsPath = `/providers/${providerId}/prefixes/${prefixId}/details`
  const navigate = useNavigate()

  const { isAllowed, rolesReady } = usePermissions()
  const canInvite = isAllowed('prefix.invite', { providerId, prefixId })
  const {
    data: prefix,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(providerId, prefixId, !!id && canInvite)

  if (!rolesReady) {
    return null
  }

  if (!canInvite) {
    return <Navigate to={detailsPath} replace />
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Invite user"
        subtitle={
          <>
            Invite a user by email and give them a role on prefix{' '}
            {prefix?.name && <strong>{prefix.name}</strong>}
          </>
        }
        navigateTo={{
          label: prefix
            ? `Back to prefix details for ${prefix.name}`
            : 'Back to prefix details',
          to: detailsPath,
        }}
        className="mb-6"
      />

      {isPrefixLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : (
        <InviteUserForm
          apiResource={PREFIX_RESOURCE}
          resourceId={String(prefixId)}
          cancelTo={detailsPath}
          onInvited={() => void navigate(detailsPath)}
        />
      )}
    </div>
  )
}

export default InviteUser
