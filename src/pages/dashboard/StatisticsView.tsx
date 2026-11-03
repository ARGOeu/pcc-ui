import StatCard from '@/components/StatCard'
import ProviderBarList from './ProviderBarList'
import type { ProviderCounts } from '@/types/dashboard'

interface StatisticsViewProps {
  totalProviders: number
  totalPrefixes: number
  totalAccounts: number
  breakdown?: ProviderCounts
}

const StatisticsView = ({
  totalProviders,
  totalPrefixes,
  totalAccounts,
  breakdown,
}: StatisticsViewProps) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <StatCard label="Providers" value={totalProviders} to="/providers" />
      <StatCard label="Prefixes" value={totalPrefixes} to="/prefixes" />
      <StatCard label="Accounts" value={totalAccounts} />
    </div>
    {breakdown && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ProviderBarList
          title="Prefixes by provider"
          items={breakdown.prefixes}
          linked
        />
        <ProviderBarList
          title="Accounts by provider"
          items={breakdown.accounts}
        />
      </div>
    )}
  </>
)

export default StatisticsView
