import type { MembersResponse } from '@/types/members'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchMembers = async (
  token: string,
  page = 1,
  size = 10,
  resource?: string,
  search?: string,
): Promise<MembersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })
  if (resource) {
    params.set('resource', resource)
  }
  if (search) {
    params.set('search', search)
  }

  const response = await fetch(
    `${BACKEND_API}/api/v1/members?${params.toString()}`,
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

  return (await response.json()) as MembersResponse
}
