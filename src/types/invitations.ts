export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED'

export type InvitationAction = 'ACCEPT' | 'REJECT'

export interface Invitation {
  id: string
  prefix_id: string
  prefix_name: string
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

export interface CreatePrefixInvitationRequest {
  email: string
  role: string
}

export interface RespondToInvitationRequest {
  action: InvitationAction
  api_resource: string
  resource_id: number
  role: string
}

export interface RespondToInvitationVariables {
  invitation: Invitation
  action: InvitationAction
}
