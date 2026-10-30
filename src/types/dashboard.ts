export interface ProviderCount {
  providerId: number
  provider: string
  logo?: string
  count: number
}

export interface ProviderCounts {
  prefixes: ProviderCount[]
  accounts: ProviderCount[]
}
