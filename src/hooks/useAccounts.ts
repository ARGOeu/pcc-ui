import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import {
  createAccount,
  deleteAccount,
  fetchAccount,
  fetchAccounts,
  updateAccount,
} from '@/api/accounts'
import type {
  Account,
  AccountRequest,
  AccountsResponse,
} from '@/types/accounts'

export const useGetAccounts = (
  providerId: number,
  prefixId: number,
  page = 1,
  size = 10,
  search?: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<AccountsResponse, Error>({
    queryKey: ['accounts', providerId, prefixId, page, size, search],
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
      return fetchAccounts(providerId, prefixId, token, page, size, search)
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: enabled && !!token && !!providerId && !!prefixId,
  })
}

export const useGetAccount = (
  providerId: number,
  prefixId: number,
  accountId: string,
  enabled = true,
) => {
  const { token } = useAuth()

  return useQuery<Account, Error>({
    queryKey: ['account', providerId, prefixId, accountId],
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
      if (!accountId) {
        throw new Error('Account ID is required')
      }
      return fetchAccount(providerId, prefixId, accountId, token)
    },
    retry: false,
    enabled: enabled && !!token && !!providerId && !!prefixId && !!accountId,
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Account,
    Error,
    { providerId: number; prefixId: number; data: AccountRequest }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      data,
    }: {
      providerId: number
      prefixId: number
      data: AccountRequest
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
      return createAccount(providerId, prefixId, data, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error) => {
      console.error('Account create error:', error)
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    Account,
    Error,
    {
      providerId: number
      prefixId: number
      accountId: string
      data: AccountRequest
    }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      accountId,
      data,
    }: {
      providerId: number
      prefixId: number
      accountId: string
      data: AccountRequest
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
      if (!accountId) {
        throw new Error('Account ID is required')
      }
      return updateAccount(providerId, prefixId, accountId, data, token)
    },
    onSuccess: (_, { providerId, prefixId, accountId }) => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
      void queryClient.invalidateQueries({
        queryKey: ['account', providerId, prefixId, accountId],
      })
    },
    onError: (error) => {
      console.error('Account update error:', error)
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation<
    void,
    Error,
    { providerId: number; prefixId: number; accountId: string }
  >({
    mutationFn: ({
      providerId,
      prefixId,
      accountId,
    }: {
      providerId: number
      prefixId: number
      accountId: string
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
      if (!accountId) {
        throw new Error('Account ID is required')
      }
      return deleteAccount(providerId, prefixId, accountId, token)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error) => {
      console.error('Account delete error:', error)
    },
  })
}
