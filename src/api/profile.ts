import type { RegistrationResponse, UserProfile } from '@/types/profile'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(`${BACKEND_API}/api/v1/users/profile`, {
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

  return (await response.json()) as UserProfile
}

export const registerUser = async (
  token: string,
): Promise<RegistrationResponse | null> => {
  const response = await fetch(`${BACKEND_API}/api/v1/users/registration`, {
    method: 'POST',
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

  if (response.status === 204) {
    return null
  }

  return (await response.json()) as RegistrationResponse
}
