import { useState } from 'react'
import { useResourceOptions } from '@/hooks/useResourceOptions'
import { useAuth } from '@/auth/useAuth'
import { PREFIX_RESOURCE, PROVIDER_RESOURCE } from '@/auth/roles'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import ErrorDisplay from '@/components/ErrorDisplay'
import InviteUserForm from '@/components/InviteUserForm'
import SelectDropdown from '@/components/SelectDropdown'
import type { SelectOption } from '@/components/SelectDropdown'

const labelClass = 'text-sm font-medium text-body mb-0.5'

const resourceTypeOptions: SelectOption[] = [
  { value: PROVIDER_RESOURCE, label: 'Provider' },
  { value: PREFIX_RESOURCE, label: 'Prefix' },
]

const AdminInviteUser = () => {
  const { rolesReady, isSuperAdmin } = useAuth()
  const [resourceType, setResourceType] = useState('')
  const [resourceId, setResourceId] = useState('')
  const [resourceLabel, setResourceLabel] = useState('')

  const isProvider = resourceType === PROVIDER_RESOURCE
  const isPrefix = resourceType === PREFIX_RESOURCE
  const resources = useResourceOptions(
    resourceType,
    undefined,
    rolesReady && isSuperAdmin,
  )

  if (!rolesReady) {
    return null
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  const handleResourceTypeChange = (value: string) => {
    setResourceType(value)
    setResourceId('')
    setResourceLabel('')
  }

  const handleResourceChange = (value: string) => {
    setResourceId(value)
    setResourceLabel(
      resources.options.find((option) => option.value === value)?.label ?? '',
    )
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Invite user"
        subtitle="Invite a user by email and give them a role on a provider or a prefix"
        className="mb-6"
      />

      <InviteUserForm
        apiResource={resourceType}
        resourceId={resourceId}
        cancelTo="/"
      >
        <div className="flex flex-col">
          <label className={labelClass}>
            Resource type <span className="required">*</span>
          </label>
          <SelectDropdown
            value={resourceType}
            onChange={handleResourceTypeChange}
            options={resourceTypeOptions}
            placeholder="Select a resource type"
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>
            {isPrefix ? 'Prefix' : isProvider ? 'Provider' : 'Resource'}{' '}
            <span className="required">*</span>
          </label>
          {resources.error ? (
            <ErrorDisplay
              error={resources.error}
              context={isProvider ? 'providers' : 'prefixes'}
            />
          ) : (
            <SelectDropdown
              value={resourceId}
              onChange={handleResourceChange}
              options={resources.options}
              selectedLabel={resourceLabel || undefined}
              placeholder={
                !resourceType
                  ? 'Select a resource type first'
                  : resources.isLoading
                    ? 'Loading...'
                    : isPrefix
                      ? 'Select a prefix'
                      : 'Select a provider'
              }
              disabled={!resourceType}
              searchable
              listSize="lg"
              onSearchChange={resources.onSearchChange}
              onScrollEnd={resources.onScrollEnd}
              footer={resources.footer}
            />
          )}
        </div>
      </InviteUserForm>
    </div>
  )
}

export default AdminInviteUser
