import type { Service } from '@/types/services'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchServices = async (token: string): Promise<Service[]> => {
  const response = await fetch(`${BACKEND_API}/api/v1/services`, {
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

  return (await response.json()) as Service[]
}
