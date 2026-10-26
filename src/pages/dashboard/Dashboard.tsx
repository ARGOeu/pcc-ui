import { useGetProviders } from '@/hooks/useProviders'
import {
  useGetAdminStatistics,
  useGetProviderStatistics,
} from '@/hooks/useStatistics'
import { useAuth } from '@/auth/useAuth'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import getProviderCounts from '@/utils/getProviderCounts'
import StatisticsView from './StatisticsView'
import type { ReactNode } from 'react'
import type { Provider } from '@/types/providers'

const getSubtitle = (
  isSuperAdmin: boolean,
  providers?: Provider[],
): ReactNode => {
  if (isSuperAdmin) {
    return 'Statistics for the whole catalogue followed by the prefixes and accounts of each provider'
  }
  if (!providers) {
    return undefined
  }
  if (providers.length === 1) {
    return (
      <>
        Statistics for your provider, <strong>{providers[0].name}</strong>, with
        its total prefixes and accounts
      </>
    )
  }
  return 'Statistics for your providers followed by the prefixes and accounts of each provider'
}

const Dashboard = () => {
  const { rolesReady, isSuperAdmin, isProviderAdmin } = useAuth()
  const hasAccess = isSuperAdmin || isProviderAdmin

  const adminStatistics = useGetAdminStatistics(isSuperAdmin)
  const providerStatistics = useGetProviderStatistics(
    isProviderAdmin && !isSuperAdmin,
  )
  const {
    data,
    isLoading: isLoadingStatistics,
    error,
  } = isSuperAdmin ? adminStatistics : providerStatistics
  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useGetProviders(hasAccess)

  if (rolesReady && !hasAccess) {
    return <Navigate to="/" replace />
  }

  const statistics = data?.total_statistics
  const showBreakdown = isSuperAdmin || (statistics?.total_providers ?? 0) > 1

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle={hasAccess ? getSubtitle(isSuperAdmin, providers) : undefined}
        className="mb-4"
      />

      {!rolesReady || isLoadingStatistics || isLoadingProviders ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="statistics" />
      ) : providersError ? (
        <ErrorDisplay error={providersError} context="providers" />
      ) : statistics && providers ? (
        <StatisticsView
          totalProviders={statistics.total_providers}
          totalPrefixes={statistics.total_prefixes}
          totalAccounts={statistics.total_accounts}
          breakdown={
            showBreakdown ? getProviderCounts(providers, statistics) : undefined
          }
        />
      ) : null}
    </div>
  )
}

export default Dashboard
