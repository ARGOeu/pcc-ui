import type { StatisticsResponse } from '@/types/statistics'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

const requestStatistics = async (
  path: string,
  token: string,
): Promise<StatisticsResponse> => {
  const response = await fetch(`${BACKEND_API}${path}`, {
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

  return (await response.json()) as StatisticsResponse
}

export const fetchAdminStatistics = (
  token: string,
): Promise<StatisticsResponse> =>
  requestStatistics('/api/v1/admin/statistics', token)

export const fetchProviderStatistics = (
  token: string,
): Promise<StatisticsResponse> =>
  requestStatistics('/api/v1/providers/statistics', token)
