import { useState } from 'react'
import {
  useCreatePrefixRequestMutation,
  useUpdatePrefixRequestMutation,
} from '@/hooks/usePrefixRequests'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import SelectDropdown from '@/components/SelectDropdown'
import isValidUrl from '@/utils/isValidUrl'
import validateEmail from '@/utils/validateEmail'
import {
  emptyRequestForm,
  expectedHandlesOptions,
} from '@/utils/prefixRequests'
import type { FormEvent } from 'react'
import type {
  ExpectedHandles,
  PrefixRequestPayload,
  RequestFormData,
} from '@/types/prefixRequests'

const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

const fields: (keyof RequestFormData)[] = [
  'contactPersonName',
  'contactPersonSurname',
  'contactPersonEmail',
  'contactPersonPhone',
  'country',
  'organizationName',
  'projectName',
  'projectUrl',
  'projectDescription',
  'expectedHandles',
]

const requiredMessages: Partial<Record<keyof RequestFormData, string>> = {
  contactPersonName: 'First name is required',
  contactPersonSurname: 'Last name is required',
  country: 'Country is required',
  organizationName: 'Organisation name is required',
  projectName: 'Project name is required',
  expectedHandles: 'Select the expected number of handles',
}

const validateField = (name: keyof RequestFormData, value: string): string => {
  if (name === 'contactPersonEmail') {
    return validateEmail(value)
  }
  const trimmed = value.trim()
  if (name === 'projectUrl') {
    if (!trimmed) {
      return 'Project URL is required'
    }
    return isValidUrl(trimmed)
      ? ''
      : 'Enter a valid address starting with http:// or https://'
  }
  const message = requiredMessages[name]
  return message && !trimmed ? message : ''
}

interface TextFieldProps {
  label: string
  name: keyof RequestFormData
  value: string
  error: string
  required?: boolean
  type?: string
  placeholder?: string
  helper?: string
  onChange: (name: keyof RequestFormData, value: string) => void
}

const TextField = ({
  label,
  name,
  value,
  error,
  required,
  type = 'text',
  placeholder,
  helper,
  onChange,
}: TextFieldProps) => (
  <div className="flex flex-col">
    <label htmlFor={name} className={labelClass}>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={name}
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className={error ? inputErrorClass : ''}
    />
    {error ? (
      <span className="text-xs text-red-500 mt-1">{error}</span>
    ) : (
      helper && <span className="text-xs text-muted mt-1">{helper}</span>
    )}
  </div>
)

interface RequestFormProps {
  initialValues: RequestFormData
  requestId?: number
}

const RequestForm = ({ initialValues, requestId }: RequestFormProps) => {
  const isEditMode = requestId !== undefined
  const navigate = useNavigate()
  const createMutation = useCreatePrefixRequestMutation()
  const updateMutation = useUpdatePrefixRequestMutation()

  const [formData, setFormData] = useState<RequestFormData>(initialValues)
  const [errors, setErrors] = useState<RequestFormData>(emptyRequestForm)

  const isFormValid = fields.every(
    (name) => !validateField(name, formData[name]),
  )
  const isSaving = createMutation.isPending || updateMutation.isPending
  const cancelPath = isEditMode ? `/requests/${requestId}/details` : '/requests'

  const handleChange = (name: keyof RequestFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const phone = formData.contactPersonPhone.trim()
    const description = formData.projectDescription.trim()
    const payload: PrefixRequestPayload = {
      contact_person_name: formData.contactPersonName.trim(),
      contact_person_surname: formData.contactPersonSurname.trim(),
      contact_person_email: formData.contactPersonEmail.trim(),
      country: formData.country.trim(),
      organization_name: formData.organizationName.trim(),
      project_name: formData.projectName.trim(),
      project_url: formData.projectUrl.trim(),
      expected_handles: formData.expectedHandles as ExpectedHandles,
      ...(phone && { contact_person_phone: phone }),
      ...(description && { project_description: description }),
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id: requestId, data: payload },
        {
          onSuccess: () => {
            toast.success('Request updated successfully!')
            void navigate(cancelPath)
          },
          onError: (error) => {
            toast.error(`Failed to update request: ${error.message}`)
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Request submitted successfully!')
          void navigate('/requests')
        },
        onError: (error) => {
          toast.error(`Failed to submit request: ${error.message}`)
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <Card
        footer={
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline-secondary"
              size="md"
              href={cancelPath}
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
                  {isEditMode ? 'Saving...' : 'Submitting...'}
                </>
              ) : isEditMode ? (
                'Save changes'
              ) : (
                'Submit request'
              )}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 px-6 pt-3 pb-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="section-title">Contact person</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <TextField
                label="First name"
                name="contactPersonName"
                value={formData.contactPersonName}
                error={errors.contactPersonName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Last name"
                name="contactPersonSurname"
                value={formData.contactPersonSurname}
                error={errors.contactPersonSurname}
                onChange={handleChange}
                required
              />
            </div>
            <TextField
              label="Email"
              name="contactPersonEmail"
              type="email"
              value={formData.contactPersonEmail}
              error={errors.contactPersonEmail}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <TextField
                label="Phone"
                name="contactPersonPhone"
                type="tel"
                value={formData.contactPersonPhone}
                error={errors.contactPersonPhone}
                onChange={handleChange}
              />
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                error={errors.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="section-title">Organisation and project</h2>
            <TextField
              label="Organisation name"
              name="organizationName"
              value={formData.organizationName}
              error={errors.organizationName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Project name"
              name="projectName"
              value={formData.projectName}
              error={errors.projectName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Project URL"
              name="projectUrl"
              value={formData.projectUrl}
              error={errors.projectUrl}
              onChange={handleChange}
              placeholder="Web address of the project"
              required
            />
            <div className="flex flex-col">
              <label htmlFor="projectDescription" className={labelClass}>
                Project description
              </label>
              <textarea
                id="projectDescription"
                rows={2}
                value={formData.projectDescription}
                onChange={(e) =>
                  handleChange('projectDescription', e.target.value)
                }
                placeholder="Describe the project and how it will use the prefix"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="section-title">Expected size</h2>
            <div className="flex flex-col">
              <span className={labelClass}>
                Expected number of handles <span className="required">*</span>
              </span>
              <SelectDropdown
                value={formData.expectedHandles}
                onChange={(value) => handleChange('expectedHandles', value)}
                options={expectedHandlesOptions}
                placeholder="Select a range..."
              />
            </div>
          </div>
        </div>
      </Card>
    </form>
  )
}

export default RequestForm
