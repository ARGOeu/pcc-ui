import { useParams } from 'react-router-dom'
import { useGetPrefix, useGetPrefixStatistics } from '@/hooks/usePrefixes'
import { usePermissions } from '@/auth/usePermissions'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import StatCard from '@/components/StatCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import capitalizeWord from '@/utils/capitalizeWord'
import DetailField from './DetailField'
import EpicCard from './EpicCard'
import EpicHealthcheckBadge from './EpicHealthcheckBadge'

const PrefixDetails = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)

  const {
    data: prefix,
    isLoading,
    error,
  } = useGetPrefix(providerId, prefixId, !!id)
  const {
    data: statistics,
    isLoading: isStatisticsLoading,
    error: statisticsError,
  } = useGetPrefixStatistics(providerId, prefixId, !!id)
  const { isAllowed } = usePermissions()

  return (
    <div className="page-container">
      <PageHeader
        title={
          prefix ? (
            <span className="font-mono">{prefix.name}</span>
          ) : (
            'Prefix details'
          )
        }
        subtitle={
          prefix && (
            <span className="inline-flex items-center gap-2">
              Registered by {prefix.provider_name}
              <EpicHealthcheckBadge value={prefix.epic_healthcheck} />
            </span>
          )
        }
        navigateTo={{
          label: 'Back to prefixes',
          to: `/prefixes?provider=${providerId}`,
        }}
        className="mb-3"
      >
        {prefix && (
          <div className="flex items-center gap-4">
            {isAllowed('prefix.invite', {
              providerId,
              prefixId: prefix.id,
            }) && (
              <Button
                variant="outline-primary"
                href={`/providers/${providerId}/prefixes/${prefix.id}/invite`}
              >
                Invite a user
              </Button>
            )}
            {isAllowed('prefix.edit', { providerId, prefixId: prefix.id }) && (
              <Button
                href={`/providers/${providerId}/prefixes/${prefix.id}/edit`}
              >
                Edit prefix
              </Button>
            )}
          </div>
        )}
      </PageHeader>

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="prefix" />
      ) : prefix ? (
        <>
          {!isStatisticsLoading && !statisticsError && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <StatCard
                label="Handles"
                value={statistics?.handles_count ?? 0}
              />
              <StatCard
                label="Resolvable"
                value={statistics?.resolvable_count ?? 0}
                valueClassName="text-green-600"
              />
              <StatCard
                label="Unresolvable"
                value={statistics?.unresolvable_count ?? 0}
                valueClassName="text-red-600"
              />
              <StatCard
                label="Unchecked"
                value={statistics?.unchecked_count ?? 0}
                valueClassName="text-muted"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 xl:gap-x-24 2xl:gap-x-32 gap-y-6">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <Card className="p-4 border-l-4 border-l-brand">
                <h2 className="section-title mb-2">Ownership & contact</h2>
                <DetailField label="Owner" value={prefix.owner} />
                <DetailField label="Contact name" value={prefix.contact_name} />
                <DetailField
                  label="Contact email"
                  value={prefix.contact_email}
                />
                <DetailField label="Used by" value={prefix.used_by} />

                <h2 className="section-title mt-6 mb-2">Contract</h2>
                <DetailField
                  label="Contract type"
                  value={
                    prefix.contract_type_name &&
                    capitalizeWord(prefix.contract_type_name)
                  }
                />
                <DetailField
                  label="Contract end"
                  value={prefix.contract_end?.split('T')[0]}
                />
              </Card>

              {prefix.epic_stats?.status === 'FOUND' &&
                prefix.epic_stats.stats !== null && (
                  <EpicCard stats={prefix.epic_stats} />
                )}
            </div>

            <Card className="h-fit p-4 border-l-4 border-l-brand lg:sticky lg:top-4">
              <h2 className="section-title mb-2">Overview</h2>
              <DetailField label="Provider" value={prefix.provider_name} />
              <DetailField
                label="Domain"
                value={prefix.domain_name && capitalizeWord(prefix.domain_name)}
              />
              <DetailField label="Service" value={prefix.service_name} />
              {prefix.lookup_service_type_name && (
                <DetailField
                  label="Lookup service type"
                  value={capitalizeWord(prefix.lookup_service_type_name)}
                />
              )}
              <DetailField
                label="Resolvable"
                value={
                  prefix.resolvable === undefined
                    ? undefined
                    : prefix.resolvable
                      ? 'Enabled'
                      : 'Disabled'
                }
              />
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default PrefixDetails
