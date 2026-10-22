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
  contacts: ProviderContact[]
}

export interface ProviderRequest {
  name: string
  description?: string
  contacts: ProviderContact[]
}
