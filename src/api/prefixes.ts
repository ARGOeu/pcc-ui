import type {
  Prefix,
  PrefixDeleteResponse,
  PrefixPartialRequest,
  PrefixRequest,
  PrefixStatistics,
  PrefixStatisticsRequest,
  PrefixesResponse,
} from '@/types/prefixes'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchPrefixes = async (
  token: string,
  page = 1,
  size = 10,
): Promise<PrefixesResponse> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/prefixes?page=${page}&size=${size}`,
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

export const fetchPrefix = async (
  id: number,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes/${id}`, {
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

  return (await response.json()) as Prefix
}

export const createPrefix = async (
  data: PrefixRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes`, {
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

  return (await response.json()) as Prefix
}

export const updatePrefix = async (
  id: number,
  data: PrefixRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes/${id}`, {
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

  return (await response.json()) as Prefix
}

export const patchPrefix = async (
  id: number,
  data: PrefixPartialRequest,
  token: string,
): Promise<Prefix> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes/${id}`, {
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
  id: number,
  token: string,
): Promise<PrefixDeleteResponse> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes/${id}`, {
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

  return (await response.json()) as PrefixDeleteResponse
}

export const fetchPrefixCount = async (
  name: string,
  token: string,
): Promise<number> => {
  const response = await fetch(`${BACKEND_API}/api/v1/prefixes/${name}/count`, {
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

  return (await response.json()) as number
}

export const fetchPrefixResolvableCount = async (
  name: string,
  token: string,
): Promise<number> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/prefixes/${name}/resolvable`,
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
  name: string,
  token: string,
): Promise<PrefixStatistics> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/prefixes/${name}/statistic`,
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
  name: string,
  data: PrefixStatisticsRequest,
  token: string,
): Promise<PrefixStatistics> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/prefixes/${name}/statistic`,
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
