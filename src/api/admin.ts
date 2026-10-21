import type { RoleAssignmentMetadata, RoleMetadata } from '@/types/admin'
import type { PrefixesResponse } from '@/types/prefixes'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchPrefixes = async (
  token: string,
  page = 1,
  size = 10,
  domain?: string,
  provider?: string,
  contractType?: string,
  search?: string,
): Promise<PrefixesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })
  if (domain) {
    params.set('domain', domain)
  }
  if (provider) {
    params.set('provider', provider)
  }
  if (contractType) {
    params.set('contract_type', contractType)
  }
  if (search) {
    params.set('search', search)
  }

  const response = await fetch(
    `${BACKEND_API}/api/v1/admin/prefixes?${params.toString()}`,
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

  return (await response.json()) as PrefixesResponse
}

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
