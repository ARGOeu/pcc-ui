import type { Provider } from '@/types/providers'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchProviders = async (token: string): Promise<Provider[]> => {
  const response = await fetch(`${BACKEND_API}/api/v1/providers`, {
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

  return (await response.json()) as Provider[]
}
