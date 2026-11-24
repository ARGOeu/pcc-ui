export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED'

export type InvitationAction = 'ACCEPT' | 'REJECT'

export type InvitationSortField = 'createdAt' | 'email' | 'status'

export type SortOrder = 'ASC' | 'DESC'

export interface InvitationSort {
  field: InvitationSortField
  order: SortOrder
}

export interface Invitation {
  id: string
  api_resource: string
  resource_id: string
  email: string
  role: string
  status: InvitationStatus
  created_at: string
}

export interface InvitationsResponse {
  content: Invitation[]
  size_of_page: number
  number_of_page: number
  total_elements: number
  total_pages: number
}

export interface CreateInvitationRequest {
  email: string
  api_resource: string
  resource_id: string
  role: string
}

export interface RespondToInvitationRequest {
  action: InvitationAction
}

export interface RespondToInvitationVariables {
  invitationId: string
  action: InvitationAction
}
