import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createHandle,
  deleteHandle,
  fetchHandle,
  fetchHandles,
  updateHandle,
} from '@/api/handles'
import { getHandleSuffix } from '@/utils/handleValues'
import type { Account } from '@/types/accounts'
import type {
  Handle,
  HandleCredentials,
  HandleRequest,
  HandleAccess,
  HandlesResponse,
  HandleUpdateRequest,
} from '@/types/handles'

const toCredentials = (
  access: Pick<HandleAccess, 'account' | 'token'>,
): HandleCredentials => ({
  serviceUrl: access.account.endpoint,
  username: access.account.username,
  handleToken: access.token,
})

export const useGetHandles = (
  providerId: number,
  prefixId: number,
  access: HandleAccess | undefined,
  page = 1,
  size = 10,
  search?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<HandlesResponse, Error>({
    queryKey: [
      'handles',
      providerId,
      prefixId,
      access?.account.id,
      access?.authorizedAt,
      page,
      size,
      search,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!access) {
        throw new Error(
          'Authorization with a Handle service account is required',
        )
      }
      return fetchHandles(
        providerId,
        prefixId,
        toCredentials(access),
        token,
        page,
        size,
        search,
      )
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: enabled && !!token && !!providerId && !!prefixId && !!access,
  })
}

export const useAuthorizeHandleServiceMutation = () => {
  const { token } = useAuth()

  return useMutation<
    HandlesResponse,
    Error,
    {
      providerId: number
      prefixId: number
      account: Account
      handleToken: string
    }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      account,
      handleToken,
    }: {
      providerId: number
      prefixId: number
      account: Account
      handleToken: string
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      return fetchHandles(
        providerId,
        prefixId,
        toCredentials({ account, token: handleToken }),
        token,
        1,
        1,
      )
    },
    onError: (error) => {
      console.error('Handle service authorize error:', error)
    },
  })
}

export const useGetHandle = (
  providerId: number,
  prefixId: number,
  suffix: string,
  access: HandleAccess | undefined,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<Handle, Error>({
    queryKey: [
      'handle',
      providerId,
      prefixId,
      suffix,
      access?.account.id,
      access?.authorizedAt,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!suffix) {
        throw new Error('Suffix is required')
      }
      if (!access) {
        throw new Error(
          'Authorization with a Handle service account is required',
        )
      }
      return fetchHandle(
        providerId,
        prefixId,
        suffix,
        toCredentials(access),
        token,
      )
    },
    retry: false,
    enabled:
      enabled && !!token && !!providerId && !!prefixId && !!suffix && !!access,
  })
}

export const useCreateHandleMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Handle,
    Error,
    {
      providerId: number
      prefixId: number
      access: HandleAccess
      data: HandleRequest
    }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      access,
      data,
    }: {
      providerId: number
      prefixId: number
      access: HandleAccess
      data: HandleRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      return createHandle(
        providerId,
        prefixId,
        data,
        toCredentials(access),
        token,
      )
    },
    onSuccess: (_data, { providerId, prefixId }) => {
      void queryClient.invalidateQueries({
        queryKey: ['handles', providerId, prefixId],
      })
    },
    onError: (error) => {
      console.error('Handle create error:', error)
    },
  })
}

export const useUpdateHandleMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Handle,
    Error,
    {
      providerId: number
      prefixId: number
      suffix: string
      access: HandleAccess
      data: HandleUpdateRequest
    }
  >({
    mutationFn: async ({
      providerId,
      prefixId,
      suffix,
      access,
      data,
    }: {
      providerId: number
      prefixId: number
      suffix: string
      access: HandleAccess
      data: HandleUpdateRequest
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!suffix) {
        throw new Error('Suffix is required')
      }
      const credentials = toCredentials(access)
      await updateHandle(providerId, prefixId, suffix, data, credentials, token)
      return fetchHandle(providerId, prefixId, suffix, credentials, token)
    },
    onSuccess: (updated, { providerId, prefixId, suffix }) => {
      queryClient.setQueriesData<Handle>(
        { queryKey: ['handle', providerId, prefixId, suffix] },
        updated,
      )
    },
    onError: (error) => {
      console.error('Handle update error:', error)
    },
  })
}

export const useDeleteHandleMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    void,
    Error,
    {
      providerId: number
      prefixId: number
      suffix: string
      access: HandleAccess
    }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      suffix,
      access,
    }: {
      providerId: number
      prefixId: number
      suffix: string
      access: HandleAccess
    }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      if (!prefixId) {
        throw new Error('Prefix ID is required')
      }
      if (!suffix) {
        throw new Error('Suffix is required')
      }
      return deleteHandle(
        providerId,
        prefixId,
        suffix,
        toCredentials(access),
        token,
      )
    },
    onSuccess: (_data, { providerId, prefixId, suffix }) => {
      queryClient.removeQueries({
        queryKey: ['handle', providerId, prefixId, suffix],
      })
      queryClient.setQueriesData<HandlesResponse>(
        { queryKey: ['handles', providerId, prefixId] },
        (previous) =>
          previous && {
            ...previous,
            content: previous.content.filter(
              (handle) => getHandleSuffix(handle) !== suffix,
            ),
            total_elements: Math.max(0, previous.total_elements - 1),
          },
      )
      void queryClient.invalidateQueries({
        queryKey: ['handles', providerId, prefixId],
        refetchType: 'none',
      })
    },
    onError: (error) => {
      console.error('Handle delete error:', error)
    },
  })
}
