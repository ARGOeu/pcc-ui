export interface Account {
  id: string
  prefix_id: number
  email: string
  endpoint: string
  username: string
  admin_index: number
  permissions: string
  created_at: string
}

export interface AccountRequest {
  email: string
  endpoint: string
  username: string
}

export interface AccountsResponse {
  content: Account[]
  size_of_page: number
  number_of_page: number
  total_elements: number
  total_pages: number
}
