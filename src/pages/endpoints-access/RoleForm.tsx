import { useState } from 'react'
import { toast } from 'sonner'
import { useGetRoleMetadata } from '@/hooks/useAdmin'
import {
  useCreateRoleMutation,
  useUpdateRoleAttributesMutation,
} from '@/hooks/useRoles'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { RoleMetadataAttribute } from '@/types/admin'
import type { Role, RoleAttributes } from '@/types/roles'

interface RoleFormProps {
  role: Role | null
  onDone: () => void
  onCancel: () => void
}

const labelClass = 'text-sm font-medium text-body mb-0.5'

const getInitialValues = (role: Role | null): Partial<Record<string, string>> =>
  Object.fromEntries(
    Object.entries(role?.attributes ?? {}).map(([key, value]) => [
      key,
      value?.[0] ?? '',
    ]),
  )

const getError = (field: RoleMetadataAttribute, value: string): string =>
  field.required && !value.trim() ? `${field.label} is required` : ''

const RoleForm = ({ role, onDone, onCancel }: RoleFormProps) => {
  const isEditMode = Boolean(role)
  const [name, setName] = useState(role?.name ?? '')
  const [values, setValues] = useState(() => getInitialValues(role))
  const [nameError, setNameError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const { data: metadata, isLoading: isMetadataLoading } = useGetRoleMetadata()
  const createRoleMutation = useCreateRoleMutation()
  const updateAttributesMutation = useUpdateRoleAttributesMutation()
  const isPending =
    createRoleMutation.isPending || updateAttributesMutation.isPending

  const metadataFields = metadata?.attributes ?? []

  const roleFields = Object.keys(role?.attributes ?? {})
    .filter(
      (key) =>
        key !== 'defaultConfiguration' &&
        !metadataFields.some((field) => field.key === key),
    )
    .map((key) => ({ key, label: key, required: false }))

  const fields = [...metadataFields, ...roleFields]

  const handleNameChange = (value: string) => {
    setName(value)
    setNameError(value.trim() ? '' : 'Role name is required')
  }

  const handleFieldChange = (field: RoleMetadataAttribute, value: string) => {
    setValues((prev) => ({ ...prev, [field.key]: value }))
    setErrors((prev) => ({ ...prev, [field.key]: getError(field, value) }))
  }

  const handleSubmit = () => {
    const isNameMissing = !isEditMode && !name.trim()
    const nextErrors: Partial<Record<string, string>> = {}
    for (const field of fields) {
      nextErrors[field.key] = getError(field, values[field.key] ?? '')
    }
    if (isNameMissing || Object.values(nextErrors).some(Boolean)) {
      setNameError(isNameMissing ? 'Role name is required' : '')
      setErrors(nextErrors)
      return
    }

    const attributes: RoleAttributes = { ...role?.attributes }
    for (const { key } of fields) {
      const value = (values[key] ?? '').trim()
      attributes[key] = value ? [value] : []
    }

    if (role) {
      updateAttributesMutation.mutate(
        { id: role.id, data: attributes },
        {
          onSuccess: () => {
            toast.success('Role updated successfully!')
            onDone()
          },
          onError: (error) => {
            toast.error(`Failed to update role: ${error.message}`)
          },
        },
      )
      return
    }

    createRoleMutation.mutate(
      { name: name.trim(), attributes },
      {
        onSuccess: () => {
          toast.success('Role created successfully!')
          onDone()
        },
        onError: (error) => {
          toast.error(`Failed to create role: ${error.message}`)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="section-title">
        {isEditMode ? `Edit ${role?.name}` : 'Create role'}
      </p>

      <div className="flex flex-col">
        <label className={labelClass}>
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter the role name"
          disabled={isEditMode}
        />
        {nameError && (
          <span className="text-xs text-red-500 mt-1">{nameError}</span>
        )}
      </div>

      {isMetadataLoading ? (
        <div className="flex justify-center py-2">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        fields.map((field) => (
          <div key={field.key} className="flex flex-col">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            <input
              type="text"
              value={values[field.key] ?? ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {errors[field.key] && (
              <span className="text-xs text-red-500 mt-1">
                {errors[field.key]}
              </span>
            )}
          </div>
        ))
      )}

      <div className="flex items-center justify-between mt-1">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || isMetadataLoading}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default RoleForm
