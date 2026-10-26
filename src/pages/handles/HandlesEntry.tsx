import { useEffect, useState } from 'react'
import { useGetAdminPrefixes } from '@/hooks/useAdmin'
import { useGetPrefix, useGetPrefixes } from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { useAuth } from '@/auth/useAuth'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import {
  clearLastHandlesPrefix,
  getLastHandlesPrefix,
} from '@/utils/lastHandlesPrefix'

const HandlesEntry = () => {
  const [lastPrefix] = useState(getLastHandlesPrefix)
  const { isSuperAdmin, rolesReady } = useAuth()

  const {
    data: savedPrefix,
    isLoading: isLoadingSaved,
    error: savedError,
  } = useGetPrefix(
    lastPrefix?.providerId ?? 0,
    lastPrefix?.prefixId ?? 0,
    !!lastPrefix,
  )
  const useFirstPrefix = !lastPrefix || !!savedError

  const {
    data: adminPrefixes,
    isLoading: isLoadingAdmin,
    error: adminError,
  } = useGetAdminPrefixes(
    1,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    useFirstPrefix && rolesReady && isSuperAdmin,
  )
  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useGetProviders(useFirstPrefix && rolesReady && !isSuperAdmin)
  const firstProvider = providers?.[0]

  const {
    data: providerPrefixes,
    isLoading: isLoadingProviderPrefixes,
    error: providerPrefixesError,
  } = useGetPrefixes(
    firstProvider?.id ?? 0,
    1,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    !!firstProvider,
  )

  // A saved prefix that no longer exists is forgotten.
  useEffect(() => {
    if (savedError) {
      clearLastHandlesPrefix()
    }
  }, [savedError])

  const firstPrefix = (isSuperAdmin ? adminPrefixes : providerPrefixes)
    ?.content[0]
  const target =
    savedPrefix && lastPrefix
      ? lastPrefix
      : firstPrefix && {
          providerId: firstPrefix.provider_id,
          prefixId: firstPrefix.id,
        }

  if (target) {
    return (
      <Navigate
        to={`/providers/${target.providerId}/prefixes/${target.prefixId}/handles`}
        replace
      />
    )
  }

  const error = isSuperAdmin
    ? adminError
    : (providersError ?? providerPrefixesError)

  return (
    <div className="page-container">
      <PageHeader title="Handles" className="mb-4" />

      {isLoadingSaved ||
      (useFirstPrefix &&
        (!rolesReady ||
          isLoadingAdmin ||
          isLoadingProviders ||
          isLoadingProviderPrefixes)) ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="prefixes" />
      ) : (
        <div className="rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs">
          <p className="text-sm italic text-muted">No prefixes found</p>
        </div>
      )}
    </div>
  )
}

export default HandlesEntry
