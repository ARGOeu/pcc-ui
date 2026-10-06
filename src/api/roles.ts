import type { CreateRoleRequest, Role, RoleAttributes } from '@/types/roles'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

interface RolesPage {
  content: Role[]
}

export const fetchRoles = async (token: string): Promise<Role[]> => {
  const response = await fetch(`${BACKEND_API}/api/v1/roles?page=1&size=100`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  const data = (await response.json()) as RolesPage
  return data.content
}

export const createRole = async (
  data: CreateRoleRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BACKEND_API}/api/v1/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
      errors?: string[]
    }
    const error = new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    ) as Error & { errors?: string[] }
    error.errors = errorData.errors ?? []
    throw error
  }
}

export const updateRoleAttributes = async (
  id: string,
  data: RoleAttributes,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BACKEND_API}/api/v1/roles/${id}/attributes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
      errors?: string[]
    }
    const error = new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    ) as Error & { errors?: string[] }
    error.errors = errorData.errors ?? []
    throw error
  }
}
