export type Scope = 'ALL' | 'MINE'

export interface SecuredEndpoint {
  secured_endpoint_id: string
  action: string
  path: string
  description?: string
  scopes?: Scope[]
}

export interface SecuredEndpointAssignment {
  secured_endpoint_id: string
  scope: Scope
}

export interface AssignEndpointsToRoleRequest {
  secured_endpoint_assignments: SecuredEndpointAssignment[]
}

export interface RoleEndpointAssignment {
  role_id: string
  role_name: string
  secured_endpoints?: SecuredEndpointAssignment[]
}

export interface RoleAssignedEndpointsResponse {
  assignments?: RoleEndpointAssignment[]
}
