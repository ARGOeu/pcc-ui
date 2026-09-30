import type {
  Prefix,
  PrefixPartialRequest,
  PrefixRequest,
  PrefixStatistics,
  PrefixStatisticsRequest,
  PrefixesResponse,
} from '@/types/prefixes'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchPrefixes = async (
  providerId: number,
  token: string,
  page = 1,
  size = 10,
  domain?: string,
  provider?: string,
  contractType?: string,
  search?: string,
): Promise<PrefixesResponse> => {
  let url = `${BACKEND_API}/api/v1/providers/${providerId}/prefixes?page=${page}&size=${size}`
  if (domain) {
    url += `&domain=${encodeURIComponent(domain)}`
  }
  if (provider) {
    url += `&provider=${encodeURIComponent(provider)}`
  }
  if (contractType) {
    url += `&contract_type=${encodeURIComponent(contractType)}`
  }
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }

  const response = await fetch(url, {
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

  return (await response.json()) as PrefixesResponse
}

export const fetchPrefix = async (
  providerId: number,
  id: number,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${id}`,
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

  return (await response.json()) as Prefix
}

export const createPrefix = async (
  providerId: number,
  data: PrefixRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes`,
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

  return (await response.json()) as Prefix
}

export const updatePrefix = async (
  providerId: number,
  id: number,
  data: PrefixRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${id}`,
    {
      method: 'PUT',
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

  return (await response.json()) as Prefix
}

export const patchPrefix = async (
  providerId: number,
  id: number,
  data: PrefixPartialRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${id}`,
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
      errors?: string[]
    }
    const error = new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    ) as Error & { errors?: string[] }
    error.errors = errorData.errors ?? []
    throw error
  }

  return (await response.json()) as Prefix
}

export const deletePrefix = async (
  providerId: number,
  id: number,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${id}`,
    {
      method: 'DELETE',
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
}

export const fetchPrefixCount = async (
  providerId: number,
  name: string,
  token: string,
): Promise<number> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${name}/count`,
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

  return (await response.json()) as number
}

export const fetchPrefixResolvableCount = async (
  providerId: number,
  name: string,
  token: string,
): Promise<number> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${name}/resolvable`,
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

  return (await response.json()) as number
}

export const fetchPrefixStatistics = async (
  providerId: number,
  name: string,
  token: string,
): Promise<PrefixStatistics> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${name}/statistic`,
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

  return (await response.json()) as PrefixStatistics
}

export const setPrefixStatistics = async (
  providerId: number,
  name: string,
  data: PrefixStatisticsRequest,
  token: string,
): Promise<PrefixStatistics> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${name}/statistic`,
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

  return (await response.json()) as PrefixStatistics
}
