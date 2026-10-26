export interface PrefixesPerProvider {
  provider: string
  total_prefixes: number
}

export interface AccountsPerProvider {
  provider: string
  total_accounts: number
}

export interface TotalStatistics {
  total_providers: number
  total_prefixes: number
  total_accounts: number
  prefixes_per_provider: PrefixesPerProvider[]
  accounts_per_provider: AccountsPerProvider[]
}

export interface StatisticsResponse {
  total_statistics: TotalStatistics
}
