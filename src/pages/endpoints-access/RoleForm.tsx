import { useState } from 'react'
import { toast } from 'sonner'
import {
  useCreateRoleMutation,
  useUpdateRoleAttributesMutation,
} from '@/hooks/useRoles'
import Button from '@/components/Button'
import type { Role } from '@/types/roles'

interface RoleFormProps {
  role: Role | null
  onDone: () => void
  onCancel: () => void
}

const labelClass = 'text-sm font-medium text-body mb-0.5'

const RoleForm = ({ role, onDone, onCancel }: RoleFormProps) => {
  const isEditMode = Boolean(role)
  const [name, setName] = useState(role?.name ?? '')
  const [preferredName, setPreferredName] = useState(
    role?.attributes?.preferred_name?.[0] ?? '',
  )
  const [description, setDescription] = useState(
    role?.attributes?.description?.[0] ?? '',
  )
  const [nameError, setNameError] = useState('')
  const [preferredNameError, setPreferredNameError] = useState('')

  const createRoleMutation = useCreateRoleMutation()
  const updateAttributesMutation = useUpdateRoleAttributesMutation()
  const isPending =
    createRoleMutation.isPending || updateAttributesMutation.isPending

  const handleNameChange = (value: string) => {
    setName(value)
    setNameError(value.trim() ? '' : 'Role name is required')
  }

  const handlePreferredNameChange = (value: string) => {
    setPreferredName(value)
    setPreferredNameError(value.trim() ? '' : 'Preferred name is required')
  }

  const handleSubmit = () => {
    const isNameMissing = !isEditMode && !name.trim()
    const isPreferredNameMissing = !preferredName.trim()
    if (isNameMissing || isPreferredNameMissing) {
      setNameError(isNameMissing ? 'Role name is required' : '')
      setPreferredNameError(
        isPreferredNameMissing ? 'Preferred name is required' : '',
      )
      return
    }

    const attributes = {
      preferred_name: [preferredName.trim()],
      description: description.trim() ? [description.trim()] : [],
    }

    if (isEditMode && role) {
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

      <div className="flex flex-col">
        <label className={labelClass}>
          Preferred name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={preferredName}
          onChange={(e) => handlePreferredNameChange(e.target.value)}
          placeholder="Enter a display name for this role"
        />
        {preferredNameError && (
          <span className="text-xs text-red-500 mt-1">
            {preferredNameError}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a short description of this role"
        />
      </div>

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
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default RoleForm
