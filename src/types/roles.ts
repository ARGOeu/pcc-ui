export interface RoleAttributes {
  preferred_name?: string[]
  description?: string[]
}

export interface Role {
  id: string
  name: string
  attributes?: RoleAttributes
}

export interface CreateRoleRequest {
  name: string
  attributes?: RoleAttributes
}
