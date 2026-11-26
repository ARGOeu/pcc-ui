export type RoleAttributes = Record<string, string[] | undefined>

export interface Role {
  id: string
  name: string
  attributes?: RoleAttributes
}

export interface CreateRoleRequest {
  name: string
  attributes?: RoleAttributes
}

export interface RevokeRoleRequest {
  api_resource: string
  resource_id: string
  role: string
  member_id: string
}
