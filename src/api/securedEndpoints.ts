import type {
  AssignEndpointsToRoleRequest,
  RoleAssignedEndpointsResponse,
  SecuredEndpoint,
} from '@/types/securedEndpoints'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

interface SecuredEndpointsPage {
  content: SecuredEndpoint[]
}

export const fetchSecuredEndpoints = async (
  token: string,
): Promise<SecuredEndpoint[]> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/secured-endpoints?page=1&size=100`,
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

  const data = (await response.json()) as SecuredEndpointsPage
  return data.content
}

export const fetchRoleAssignedEndpoints = async (
  roleId: string,
  token: string,
): Promise<RoleAssignedEndpointsResponse> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/roles/${roleId}/assigned-endpoints`,
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

  return (await response.json()) as RoleAssignedEndpointsResponse
}

export const fetchAllRoleAssignedEndpoints = async (
  token: string,
): Promise<RoleAssignedEndpointsResponse> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/roles/assigned-endpoints`,
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

  return (await response.json()) as RoleAssignedEndpointsResponse
}

export const assignEndpointsToRole = async (
  roleId: string,
  data: AssignEndpointsToRoleRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/roles/${roleId}/assign-endpoints`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  )

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
