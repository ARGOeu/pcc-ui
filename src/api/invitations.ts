import type {
  CreatePrefixInvitationRequest,
  Invitation,
  InvitationsResponse,
  RespondToInvitationRequest,
} from '@/types/invitations'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchUserInvitations = async (
  token: string,
  page = 1,
  size = 10,
): Promise<InvitationsResponse> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/users/invitation?page=${page}&size=${size}`,
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

  return (await response.json()) as InvitationsResponse
}

export const fetchUserInvitation = async (
  id: string,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(`${BACKEND_API}/api/v1/users/invitation/${id}`, {
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

  return (await response.json()) as Invitation
}

export const respondToInvitation = async (
  invitationId: string,
  data: RespondToInvitationRequest,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/users/invitation/${invitationId}`,
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
    }
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`,
    )
  }

  return (await response.json()) as Invitation
}

export const fetchPrefixInvitations = async (
  providerId: number,
  prefixId: number,
  token: string,
  page = 1,
  size = 10,
  search?: string,
): Promise<InvitationsResponse> => {
  let url = `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/invitations?page=${page}&size=${size}`
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

  return (await response.json()) as InvitationsResponse
}

export const fetchPrefixInvitation = async (
  providerId: number,
  prefixId: number,
  invitationId: string,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/invitations/${invitationId}`,
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

  return (await response.json()) as Invitation
}

export const createPrefixInvitation = async (
  providerId: number,
  prefixId: number,
  data: CreatePrefixInvitationRequest,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/invitations`,
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

  return (await response.json()) as Invitation
}

export const revokePrefixInvitation = async (
  providerId: number,
  prefixId: number,
  invitationId: string,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/providers/${providerId}/prefixes/${prefixId}/invitations/${invitationId}`,
    {
      method: 'PATCH',
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

  return (await response.json()) as Invitation
}
