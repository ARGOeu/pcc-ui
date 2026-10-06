export interface RoleMetadataAttribute {
  key: string
  label: string
  required: boolean
}

export interface RoleMetadata {
  attributes: RoleMetadataAttribute[]
}

export interface RoleAssignmentMetadata {
  resources: Record<string, unknown>
}
