import type {
  CreateInvitationRequest,
  Invitation,
  InvitationSortField,
  InvitationsResponse,
  RespondToInvitationRequest,
  SortOrder,
} from '@/types/invitations'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

export const fetchUserInvitations = async (
  token: string,
  page = 1,
  size = 10,
): Promise<InvitationsResponse> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/users/invitations?page=${page}&size=${size}`,
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
  const response = await fetch(
    `${BACKEND_API}/api/v1/users/invitations/${id}`,
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

export const respondToInvitation = async (
  invitationId: string,
  data: RespondToInvitationRequest,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/users/invitations/${invitationId}`,
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

export const fetchInvitations = async (
  token: string,
  page = 1,
  size = 10,
  apiResource?: string,
  resourceId?: string,
  search?: string,
  sort?: InvitationSortField,
  order?: SortOrder,
): Promise<InvitationsResponse> => {
  let url = `${BACKEND_API}/api/v1/invitations?page=${page}&size=${size}`
  if (apiResource) {
    url += `&api_resource=${encodeURIComponent(apiResource)}`
  }
  if (resourceId) {
    url += `&resource_id=${encodeURIComponent(resourceId)}`
  }
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }
  if (sort) {
    url += `&sort=${sort}`
  }
  if (order) {
    url += `&order=${order}`
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

export const fetchInvitation = async (
  invitationId: string,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/invitations/${invitationId}`,
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

export const createInvitation = async (
  data: CreateInvitationRequest,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(`${BACKEND_API}/api/v1/invitations`, {
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

  return (await response.json()) as Invitation
}

export const revokeInvitation = async (
  invitationId: string,
  token: string,
): Promise<Invitation> => {
  const response = await fetch(
    `${BACKEND_API}/api/v1/invitations/${invitationId}`,
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
