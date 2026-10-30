export interface ProviderContact {
  id?: number
  name: string
  email: string
  type: string
}

export interface Provider {
  id: number
  name: string
  description?: string
  logo?: string
  contacts: ProviderContact[]
}

export interface ProviderRequest {
  name: string
  description?: string
  logo?: string | null
  contacts: ProviderContact[]
}
