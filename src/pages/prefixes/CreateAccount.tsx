import { useEffect, useState } from 'react'
import { useGetPrefix } from '@/hooks/usePrefixes'
import {
  useCreateAccountMutation,
  useGetAccount,
  useUpdateAccountMutation,
} from '@/hooks/useAccounts'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import validateEmail from '@/utils/validateEmail'
import type { FormEvent } from 'react'

const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

interface FormData {
  email: string
  endpoint: string
  username: string
}

const emptyForm: FormData = { email: '', endpoint: '', username: '' }

const isValidUrl = (value: string): boolean => {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

const validateField = (name: keyof FormData, value: string): string => {
  if (name === 'email') {
    return validateEmail(value)
  }
  const trimmed = value.trim()
  if (name === 'username') {
    return trimmed ? '' : 'Username is required'
  }
  if (!trimmed) {
    return 'Endpoint is required'
  }
  return isValidUrl(trimmed)
    ? ''
    : 'Enter a valid address starting with http:// or https://'
}

const CreateAccount = () => {
  const {
    providerId: providerIdParam,
    id,
    accountId,
  } = useParams<{
    providerId: string
    id: string
    accountId?: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const isEditMode = Boolean(accountId)
  const accountsPath = `/providers/${providerId}/prefixes/${prefixId}/accounts`
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<FormData>(emptyForm)

  const {
    data: prefix,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(providerId, prefixId, !!id)
  const {
    data: account,
    isLoading: isAccountLoading,
    error: accountError,
  } = useGetAccount(providerId, prefixId, accountId ?? '', isEditMode)
  const createMutation = useCreateAccountMutation()
  const updateMutation = useUpdateAccountMutation()

  useEffect(() => {
    if (isEditMode && account) {
      // eslint-disable-next-line react-hooks/set-state-in-effect, react-x/set-state-in-effect
      setFormData({
        ...emptyForm,
        email: account.email,
        endpoint: account.endpoint,
        username: account.username ?? '',
      })
    }
  }, [isEditMode, account])

  const isFormValid =
    !validateField('email', formData.email) &&
    !validateField('endpoint', formData.endpoint) &&
    !validateField('username', formData.username)
  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      email: formData.email.trim(),
      endpoint: formData.endpoint.trim(),
      username: formData.username.trim(),
    }

    if (isEditMode && accountId) {
      updateMutation.mutate(
        { providerId, prefixId, accountId, data },
        {
          onSuccess: () => {
            toast.success('Account updated successfully!')
            void navigate(accountsPath)
          },
          onError: (error) => {
            toast.error(`Failed to update account: ${error.message}`)
          },
        },
      )
    } else {
      createMutation.mutate(
        { providerId, prefixId, data },
        {
          onSuccess: () => {
            toast.success('Account added successfully!')
            void navigate(accountsPath)
          },
          onError: (error) => {
            toast.error(`Failed to add account: ${error.message}`)
          },
        },
      )
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={isEditMode ? 'Edit account' : 'Add account'}
        subtitle={
          isEditMode ? (
            <>
              Update the account
              {account?.email && <strong> {account.email}</strong>} on prefix
              {prefix?.name && (
                <strong className="font-mono"> {prefix.name}</strong>
              )}
            </>
          ) : (
            <>
              Add a Handle service account to prefix
              {prefix?.name && (
                <strong className="font-mono"> {prefix.name}</strong>
              )}
            </>
          )
        }
        navigateTo={{ label: 'Back to accounts', to: accountsPath }}
        className="mb-4"
      />

      {isPrefixLoading || (isEditMode && isAccountLoading) ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : isEditMode && accountError ? (
        <ErrorDisplay error={accountError} context="account" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
          <Card
            footer={
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline-secondary"
                  size="md"
                  href={accountsPath}
                  className="my-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!isFormValid || isSaving}
                  className="my-2"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="xs" className="text-white!" />
                      {isEditMode ? 'Saving...' : 'Adding...'}
                    </>
                  ) : isEditMode ? (
                    'Save changes'
                  ) : (
                    'Add account'
                  )}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              <div className="flex flex-col">
                <label className={labelClass}>
                  Endpoint <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.endpoint}
                  onChange={(e) => handleChange('endpoint', e.target.value)}
                  placeholder="Enter the URL of the Handle service"
                  className={errors.endpoint ? inputErrorClass : ''}
                />
                {errors.endpoint ? (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.endpoint}
                  </span>
                ) : (
                  <span className="text-xs text-muted mt-1">
                    The URL of the Handle service that this account connects to
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter the username of the Handle service"
                  className={errors.username ? inputErrorClass : ''}
                />
                {errors.username ? (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.username}
                  </span>
                ) : (
                  <span className="text-xs text-muted mt-1">
                    The username used to authenticate this account with the
                    Handle service
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter the email address of the account"
                  className={errors.email ? inputErrorClass : ''}
                />
                {errors.email ? (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </span>
                ) : (
                  <span className="text-xs text-muted mt-1">
                    The contact email address for this account
                  </span>
                )}
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

export default CreateAccount
