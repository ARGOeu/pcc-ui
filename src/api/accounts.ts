import type {
  Account,
  AccountRequest,
  AccountsResponse,
} from '@/types/accounts'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchAccounts = async (
  providerId: number,
  prefixId: number,
  token: string,
  page = 1,
  size = 10,
  search?: string,
): Promise<AccountsResponse> => {
  let url = `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/accounts?page=${page}&size=${size}`
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

  return (await response.json()) as AccountsResponse
}

export const fetchAccount = async (
  providerId: number,
  prefixId: number,
  accountId: string,
  token: string,
): Promise<Account> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/accounts/${accountId}`,
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

  return (await response.json()) as Account
}

export const createAccount = async (
  providerId: number,
  prefixId: number,
  data: AccountRequest,
  token: string,
): Promise<Account> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/accounts`,
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

  return (await response.json()) as Account
}

export const updateAccount = async (
  providerId: number,
  prefixId: number,
  accountId: string,
  data: AccountRequest,
  token: string,
): Promise<Account> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/accounts/${accountId}`,
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

  return (await response.json()) as Account
}

export const deleteAccount = async (
  providerId: number,
  prefixId: number,
  accountId: string,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/accounts/${accountId}`,
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
