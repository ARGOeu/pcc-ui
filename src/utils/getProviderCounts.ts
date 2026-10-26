import type { ProviderCount, ProviderCounts } from '@/types/dashboard'
import type { Provider } from '@/types/providers'
import type { TotalStatistics } from '@/types/statistics'

interface CountedProvider {
  provider: string
  count: number
}

const collectCounts = (
  providers: Provider[],
  counted: CountedProvider[],
): ProviderCount[] => {
  const countByName = new Map(
    counted.map(({ provider, count }): [string, number] => [provider, count]),
  )

  return providers.map(({ id, name }) => ({
    providerId: id,
    provider: name,
    count: countByName.get(name) ?? 0,
  }))
}

const rank = (
  items: ProviderCount[],
  others: ProviderCount[],
): ProviderCount[] => {
  const otherCountByName = new Map(
    others.map(({ provider, count }): [string, number] => [provider, count]),
  )

  return [...items].sort(
    (a, b) =>
      b.count - a.count ||
      (otherCountByName.get(b.provider) ?? 0) -
        (otherCountByName.get(a.provider) ?? 0) ||
      a.provider.localeCompare(b.provider),
  )
}

const getProviderCounts = (
  providers: Provider[],
  statistics: TotalStatistics,
): ProviderCounts => {
  const prefixes = collectCounts(
    providers,
    statistics.prefixes_per_provider.map(({ provider, total_prefixes }) => ({
      provider,
      count: total_prefixes,
    })),
  )
  const accounts = collectCounts(
    providers,
    statistics.accounts_per_provider.map(({ provider, total_accounts }) => ({
      provider,
      count: total_accounts,
    })),
  )

  return {
    prefixes: rank(prefixes, accounts),
    accounts: rank(accounts, prefixes),
  }
}

export default getProviderCounts
