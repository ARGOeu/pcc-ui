export interface PrefixDeleteResponse {
  message: string
}

export interface Prefix {
  id: number
  name: string
  owner: string
  used_by?: string
  contract_end?: string
  status?: number
  domain_id?: number
  provider_id: number
  resolvable?: boolean
  contact_name: string
  contact_email: string
  contract_type_id?: number
  lookup_service_type_id?: number
  service_name?: string
  domain_name?: string
  provider_name?: string
  contract_type_name?: string
  lookup_service_type_name?: string
}

export interface PrefixRequest {
  name: string
  owner: string
  used_by?: string
  contract_end?: string
  status?: number
  service_name?: string
  domain_id?: number
  provider_id: number
  resolvable?: boolean
  contact_name: string
  contact_email: string
  contract_type_id?: number
  lookup_service_type_id?: number
}

export interface PrefixPartialRequest {
  name?: string
  owner?: string
  used_by?: string
  contract_end?: string
  status?: string
  service_name?: string
  domain_id?: number
  provider_id?: number
  resolvable?: boolean
  contact_name?: string
  contact_email?: string
  contract_type_id?: number
  lookup_service_type_id?: number
}

export interface PrefixesResponse {
  content: Prefix[]
  size_of_page: number
  number_of_page: number
  total_elements: number
  total_pages: number
}

export interface PrefixStatistics {
  prefix?: string
  handles_count: number
  resolvable_count: number
  unresolvable_count: number
  unchecked_count: number
}

export interface PrefixStatisticsRequest {
  handles_count?: number
  resolvable_count?: number
  unresolvable_count?: number
  unchecked_count?: number
}
