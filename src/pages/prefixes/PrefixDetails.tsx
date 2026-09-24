import { useParams } from 'react-router-dom'
import { useGetPrefix, useGetPrefixStatistics } from '@/hooks/usePrefixes'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import type { ReactNode } from 'react'

interface DetailFieldProps {
  label: string
  value?: string
}

const DetailField = ({ label, value }: DetailFieldProps) => (
  <div className="flex justify-between gap-4 py-2 border-b border-line last:border-b-0">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-sm text-foreground font-medium text-right">
      {value ?? '—'}
    </span>
  </div>
)

interface StatCardProps {
  label: string
  value: ReactNode
  valueClassName?: string
  caption?: string
}

const StatCard = ({ label, value, valueClassName, caption }: StatCardProps) => (
  <Card className="px-3 py-2">
    <div className="text-sm text-muted mb-0.5">{label}</div>
    <div
      className={`text-2xl font-semibold ${valueClassName ?? 'text-foreground'}`}
    >
      {value}
    </div>
    {caption && <div className="text-xs text-muted">{caption}</div>}
  </Card>
)

const PrefixDetails = () => {
  const { id } = useParams<{ id: string }>()
  const prefixId = Number(id)

  const { data: prefix, isLoading, error } = useGetPrefix(prefixId, !!id)
  const {
    data: statistics,
    isLoading: isStatisticsLoading,
    error: statisticsError,
  } = useGetPrefixStatistics(prefix?.name ?? '', !!prefix)

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
        subtitle={prefix && `Registered by ${prefix.provider_name}`}
        navigateTo={{ label: 'Back to prefixes', to: '/prefixes' }}
        className="mb-3"
      >
        {prefix && (
          <Button href={`/prefixes/${prefix.id}/edit`}>Edit prefix</Button>
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
            <Card className="lg:col-span-2 p-4 border-l-4 border-l-brand">
              <h2 className="section-title mb-2">Ownership & contact</h2>
              <DetailField label="Owner" value={prefix.owner} />
              <DetailField label="Contact name" value={prefix.contact_name} />
              <DetailField label="Contact email" value={prefix.contact_email} />
              <DetailField label="Used by" value={prefix.used_by} />

              <h2 className="section-title mt-6 mb-2">Contract</h2>
              <DetailField
                label="Contract type"
                value={prefix.contract_type_name}
              />
              <DetailField
                label="Contract end"
                value={prefix.contract_end?.split('T')[0]}
              />
            </Card>

            <Card className="h-fit p-4 border-l-4 border-l-brand lg:sticky lg:top-4">
              <h2 className="section-title mb-2">Overview</h2>
              <DetailField label="Provider" value={prefix.provider_name} />
              <DetailField label="Domain" value={prefix.domain_name} />
              <DetailField label="Service" value={prefix.service_name} />
              {prefix.lookup_service_type_name && (
                <DetailField
                  label="Lookup service type"
                  value={prefix.lookup_service_type_name}
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
