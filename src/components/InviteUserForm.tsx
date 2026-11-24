import { useState } from 'react'
import { useGetRoles } from '@/hooks/useRoles'
import { useCreateInvitationMutation } from '@/hooks/useInvitations'
import { INVITABLE_ROLES } from '@/auth/roles'
import { toast } from 'sonner'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SelectDropdown from '@/components/SelectDropdown'
import validateEmail from '@/utils/validateEmail'
import type { FormEvent, ReactNode } from 'react'

const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

interface FormData {
  email: string
  role: string
}

const emptyForm: FormData = { email: '', role: '' }

const validateField = (name: keyof FormData, value: string): string => {
  if (name === 'email') {
    return validateEmail(value)
  }
  return value ? '' : 'Select a role'
}

interface InviteUserFormProps {
  apiResource: string
  resourceId: string
  cancelTo: string
  children?: ReactNode
  onInvited?: () => void
}

const InviteUserForm = ({
  apiResource,
  resourceId,
  cancelTo,
  children,
  onInvited,
}: InviteUserFormProps) => {
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<FormData>(emptyForm)
  const [previousResource, setPreviousResource] = useState(apiResource)

  if (previousResource !== apiResource) {
    setPreviousResource(apiResource)
    setFormData((prev) => ({ ...prev, role: '' }))
    setErrors((prev) => ({ ...prev, role: '' }))
  }

  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useGetRoles()
  const createMutation = useCreateInvitationMutation()

  const roleOptions = (INVITABLE_ROLES[apiResource] ?? []).flatMap((name) => {
    const role = roles?.find((item) => item.name === name)
    return role
      ? [
          {
            value: role.name,
            label: role.attributes?.preferred_name?.[0] ?? role.name,
          },
        ]
      : []
  })
  const isFormValid =
    !!apiResource &&
    !!resourceId &&
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
        email: formData.email.trim(),
        api_resource: apiResource,
        resource_id: resourceId,
        role: formData.role,
      },
      {
        onSuccess: () => {
          toast.success('Invitation sent successfully!')
          setFormData(emptyForm)
          onInvited?.()
        },
        onError: (error) => {
          toast.error(`Failed to send invitation: ${error.message}`)
        },
      },
    )
  }

  if (rolesError) {
    return <ErrorDisplay error={rolesError} context="roles" />
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <Card
        footer={
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline-secondary"
              size="md"
              href={cancelTo}
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
        <div className="flex flex-col gap-2.5 px-6 py-4">
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
              <span className="text-xs text-red-500 mt-1">{errors.email}</span>
            )}
          </div>

          {children}

          <div className="flex flex-col">
            <label className={labelClass}>
              Role <span className="required">*</span>
            </label>
            <SelectDropdown
              value={formData.role}
              onChange={(value) => handleChange('role', value)}
              options={roleOptions}
              placeholder={
                isLoadingRoles
                  ? 'Loading roles...'
                  : apiResource
                    ? 'Select a role'
                    : 'Select a resource type first'
              }
              disabled={isLoadingRoles || !apiResource}
            />
            {errors.role && (
              <span className="text-xs text-red-500 mt-1">{errors.role}</span>
            )}
          </div>
        </div>
      </Card>
    </form>
  )
}

export default InviteUserForm
