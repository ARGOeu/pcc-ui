import type { Account } from '@/types/accounts'

export interface HandleValue {
  index: number
  type: string
  data: {
    format: string
    value: unknown
  }
  ttl?: number
  timestamp?: string
}

export interface Handle {
  handle: string
  values: HandleValue[]
}

export interface HandleValueRequest {
  type: string
  value: string
}

export interface HandleRequest {
  suffix: string
  values: HandleValueRequest[]
}

export interface HandleUpdateRequest {
  values: HandleValueRequest[]
}

export interface HandlesResponse {
  content: string[]
  size_of_page: number
  number_of_page: number
  total_elements: number
  total_pages: number
}

export interface HandleCredentials {
  serviceUrl: string
  username: string
  handleToken: string
}

export interface HandleAccess {
  account: Account
  token: string
  authorizedAt: number
}
