import type { Provider, ProviderRequest } from '@/types/providers'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

const throwRequestError = async (response: Response): Promise<never> => {
  const errorData = (await response.json().catch(() => ({}))) as {
    message?: string
  }
  throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`)
}

export const fetchProviders = async (token: string): Promise<Provider[]> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  return (await response.json()) as Provider[]
}

export const fetchProvider = async (
  id: number,
  token: string,
): Promise<Provider> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  return (await response.json()) as Provider
}

export const createProvider = async (
  data: ProviderRequest,
  token: string,
): Promise<Provider> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  return (await response.json()) as Provider
}

// The backend exposes the provider update as PATCH
export const updateProvider = async (
  id: number,
  data: ProviderRequest,
  token: string,
): Promise<Provider> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    return throwRequestError(response)
  }

  return (await response.json()) as Provider
}

export const deleteProvider = async (
  id: number,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return throwRequestError(response)
  }
}
