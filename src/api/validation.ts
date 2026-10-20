import type { ValidateUrlResponse } from '@/types/validation'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const validateUrl = async (
  url: string,
  token: string,
): Promise<ValidateUrlResponse> => {
  const response = await fetch(`${BACKEND_API}/api/v1/validate-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as ValidateUrlResponse
}
