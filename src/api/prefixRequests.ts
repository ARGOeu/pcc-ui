import type {
  PrefixRequest,
  PrefixRequestReviewPayload,
  PrefixRequestPayload,
} from '@/types/prefixRequests'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchPrefixRequests = async (
  token: string,
): Promise<PrefixRequest[]> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefix-requests`, {
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

  return (await response.json()) as PrefixRequest[]
}

export const fetchProviderPrefixRequests = async (
  token: string,
): Promise<PrefixRequest[]> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/prefix-requests/by-provider`,
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

  return (await response.json()) as PrefixRequest[]
}

export const fetchPrefixRequest = async (
  id: number,
  token: string,
): Promise<PrefixRequest> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefix-requests/${id}`, {
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

  return (await response.json()) as PrefixRequest
}

export const createPrefixRequest = async (
  data: PrefixRequestPayload,
  token: string,
): Promise<PrefixRequest> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefix-requests`, {
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
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as PrefixRequest
}

export const updatePrefixRequest = async (
  id: number,
  data: PrefixRequestPayload,
  token: string,
): Promise<PrefixRequest> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefix-requests/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as PrefixRequest
}

export const deletePrefixRequest = async (
  id: number,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefix-requests/${id}`, {
    method: 'DELETE',
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
}

export const updatePrefixRequestStatus = async (
  id: number,
  data: PrefixRequestReviewPayload,
  token: string,
): Promise<PrefixRequest> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/admin/prefix-request/${id}/status`,
    {
      method: 'PATCH',
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
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as PrefixRequest
}

export const assignPrefixRequestProvider = async (
  id: number,
  providerId: number,
  token: string,
): Promise<PrefixRequest> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/admin/prefix-requests/${id}/assign-provider`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ providerId }),
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

  return (await response.json()) as PrefixRequest
}
