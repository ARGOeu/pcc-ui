export interface UserProfile {
  id: string
  username?: string
  email?: string
  name?: string
  surname?: string
  memberships?: Record<string, unknown>
}

export interface RegistrationResponse {
  code?: number
  message?: string
  errors?: string[]
}
