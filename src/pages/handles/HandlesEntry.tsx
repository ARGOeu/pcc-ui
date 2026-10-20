import { useEffect, useState } from 'react'
import { useGetAllPrefixes } from '@/hooks/useAdmin'
import { useGetPrefix } from '@/hooks/usePrefixes'
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
  const { data, isLoading, error } = useGetAllPrefixes(
    1,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    useFirstPrefix,
  )

  // A saved prefix that no longer exists is forgotten.
  useEffect(() => {
    if (savedError) {
      clearLastHandlesPrefix()
    }
  }, [savedError])

  const firstPrefix = data?.content[0]
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

  return (
    <div className="page-container">
      <PageHeader title="Handles" className="mb-4" />

      {isLoadingSaved || (useFirstPrefix && isLoading) ? (
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
