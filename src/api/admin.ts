import type { RoleAssignmentMetadata, RoleMetadata } from '@/types/admin'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchRoleMetadata = async (
  token: string,
): Promise<RoleMetadata> => {
  const response = await fetch(`${BACKEND_API}/api/v1/admin/roles/metadata`, {
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

  return (await response.json()) as RoleMetadata
}

export const fetchRoleAssignmentMetadata = async (
  token: string,
): Promise<RoleAssignmentMetadata> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/admin/roles/assignment/metadata`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as RoleAssignmentMetadata
}
