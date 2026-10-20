import type {
  Handle,
  HandleCredentials,
  HandleRequest,
  HandlesResponse,
  HandleUpdateRequest,
} from '@/types/handles'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

const tokenRejectedMessage = 'The token was rejected by the Handle service.'
const connectionFailedMessage = 'Could not connect to the Handle service.'
const sessionExpiredPattern = /401|unauthorized/i

type HandleServiceError = Error & { tokenRejected?: boolean }

// An unauthorized answer without a message comes from PCC. Any other failure comes from the Handle service.
const toRequestError = async (response: Response): Promise<Error> => {
  const errorData = (await response.json().catch(() => ({}))) as {
    message?: string
  }
  if (response.status === 401 && !errorData.message) {
    return new Error(`HTTP error! status: ${response.status}`)
  }
  const tokenRejected = response.status === 401 || response.status === 403
  const error: HandleServiceError = new Error(
    errorData.message && !sessionExpiredPattern.test(errorData.message)
      ? errorData.message
      : tokenRejected
        ? tokenRejectedMessage
        : connectionFailedMessage,
  )
  error.tokenRejected = tokenRejected
  return error
}

const buildHeaders = (
  token: string,
  credentials: HandleCredentials,
): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  'x-handle-service-url': credentials.serviceUrl,
  'x-handle-username': credentials.username,
  'x-handle-token': credentials.handleToken,
})

const buildHandlesUrl = (providerId: number, prefixId: number): string =>
  `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/handles`

export const fetchHandles = async (
  providerId: number,
  prefixId: number,
  credentials: HandleCredentials,
  token: string,
  page = 1,
  size = 10,
  search?: string,
): Promise<HandlesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  })
  if (search) {
    params.set('search', search)
  }

  const response = await fetch(
    `${buildHandlesUrl(providerId, prefixId)}?${params.toString()}`,
    {
      method: 'GET',
      headers: buildHeaders(token, credentials),
    },
  )

  if (!response.ok) {
    throw await toRequestError(response)
  }

  return (await response.json()) as HandlesResponse
}

export const isTokenRejected = (error: Error | null): boolean =>
  !!error && 'tokenRejected' in error && error.tokenRejected === true

export const fetchHandle = async (
  providerId: number,
  prefixId: number,
  suffix: string,
  credentials: HandleCredentials,
  token: string,
): Promise<Handle> => {
  const response = await fetch(
    `${buildHandlesUrl(providerId, prefixId)}/${encodeURIComponent(suffix)}`,
    {
      method: 'GET',
      headers: buildHeaders(token, credentials),
    },
  )

  if (!response.ok) {
    throw await toRequestError(response)
  }

  return (await response.json()) as Handle
}

export const createHandle = async (
  providerId: number,
  prefixId: number,
  data: HandleRequest,
  credentials: HandleCredentials,
  token: string,
): Promise<Handle> => {
  const response = await fetch(buildHandlesUrl(providerId, prefixId), {
    method: 'POST',
    headers: buildHeaders(token, credentials),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw await toRequestError(response)
  }

  return (await response.json()) as Handle
}

export const updateHandle = async (
  providerId: number,
  prefixId: number,
  suffix: string,
  data: HandleUpdateRequest,
  credentials: HandleCredentials,
  token: string,
): Promise<Handle> => {
  const response = await fetch(
    `${buildHandlesUrl(providerId, prefixId)}/${encodeURIComponent(suffix)}`,
    {
      method: 'PUT',
      headers: buildHeaders(token, credentials),
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw await toRequestError(response)
  }

  return (await response.json()) as Handle
}

export const deleteHandle = async (
  providerId: number,
  prefixId: number,
  suffix: string,
  credentials: HandleCredentials,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${buildHandlesUrl(providerId, prefixId)}/${encodeURIComponent(suffix)}`,
    {
      method: 'DELETE',
      headers: buildHeaders(token, credentials),
    },
  )

  if (!response.ok) {
    throw await toRequestError(response)
  }
}
