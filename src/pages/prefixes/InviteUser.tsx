import { useState } from 'react'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useGetRoles } from '@/hooks/useRoles'
import { useCreatePrefixInvitationMutation } from '@/hooks/useInvitations'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SelectDropdown from '@/components/SelectDropdown'
import type { FormEvent } from 'react'

const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormData {
  email: string
  role: string
}

const emptyForm: FormData = { email: '', role: '' }

const validateField = (name: keyof FormData, value: string): string => {
  if (name === 'email') {
    if (!value.trim()) {
      return 'Email is required'
    }
    return emailPattern.test(value.trim()) ? '' : 'Enter a valid email address'
  }
  return value ? '' : 'Select a role'
}

const InviteUser = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<FormData>(emptyForm)

  const {
    data: prefix,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(providerId, prefixId, !!id)
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useGetRoles()
  const createMutation = useCreatePrefixInvitationMutation()

  const roleOptions = (roles ?? [])
    .filter((role) => role.name !== 'members')
    .map((role) => ({
      value: role.name,
      label: role.attributes?.preferred_name?.[0] ?? role.name,
    }))
  const roleDescription = roles?.find((role) => role.name === formData.role)
    ?.attributes?.description?.[0]
  const isFormValid =
    !validateField('email', formData.email) &&
    !validateField('role', formData.role)

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createMutation.mutate(
      {
        providerId,
        prefixId,
        data: { email: formData.email.trim(), role: formData.role },
      },
      {
        onSuccess: () => {
          toast.success('Invitation sent successfully!')
          void navigate(`/providers/${providerId}/prefixes/${prefixId}/details`)
        },
        onError: (error) => {
          toast.error(`Failed to send invitation: ${error.message}`)
        },
      },
    )
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Invite user"
        subtitle={
          <>
            Invite a user by email and give them a role on prefix
            {prefix?.name && <strong> {prefix.name}</strong>}
          </>
        }
        navigateTo={{
          label: prefix
            ? `Back to prefix details for ${prefix.name}`
            : 'Back to prefix details',
          to: `/providers/${providerId}/prefixes/${prefixId}/details`,
        }}
        className="mb-6"
      />

      {isPrefixLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : rolesError ? (
        <ErrorDisplay error={rolesError} context="roles" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
          <Card
            footer={
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline-secondary"
                  size="md"
                  href={`/providers/${providerId}/prefixes/${prefixId}/details`}
                  className="my-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!isFormValid || createMutation.isPending}
                  className="my-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <LoadingSpinner size="xs" className="text-white!" />
                      Sending...
                    </>
                  ) : (
                    'Send invitation'
                  )}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              <div className="flex flex-col">
                <label className={labelClass}>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter the email address of the user"
                  className={errors.email ? inputErrorClass : ''}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Role <span className="required">*</span>
                </label>
                <SelectDropdown
                  value={formData.role}
                  onChange={(value) => handleChange('role', value)}
                  options={roleOptions}
                  placeholder={
                    isLoadingRoles ? 'Loading roles...' : 'Select a role'
                  }
                  disabled={isLoadingRoles}
                />
                {errors.role && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.role}
                  </span>
                )}
                <span className="text-xs text-muted mt-1">
                  {roleDescription ??
                    'The role the user gets on this prefix once they accept'}
                </span>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

export default InviteUser
