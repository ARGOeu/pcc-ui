import { PREFIX_RESOURCE, PROVIDER_RESOURCE } from '@/auth/roles'
import SearchInput from '@/components/SearchInput'
import SelectDropdown from '@/components/SelectDropdown'
import type { SelectOption } from '@/components/SelectDropdown'
import type { InvitationResource } from './useInvitationResource'

const resourceTypeOptions: SelectOption[] = [
  { value: PROVIDER_RESOURCE, label: 'Providers' },
  { value: PREFIX_RESOURCE, label: 'Prefixes' },
]

interface InvitationsFiltersProps {
  resource: InvitationResource
  searchInput: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
}

const InvitationsFilters = ({
  resource,
  searchInput,
  onSearchChange,
  onSearchClear,
}: InvitationsFiltersProps) => {
  const { isSuperAdmin, isPrefix, resources } = resource

  // Only a super admin can list the invitations of all resources
  const typeOptions: SelectOption[] = isSuperAdmin
    ? [{ value: '', label: 'All resources' }, ...resourceTypeOptions]
    : resourceTypeOptions

  const resourceOptions: SelectOption[] = isSuperAdmin
    ? [
        { value: '', label: isPrefix ? 'All prefixes' : 'All providers' },
        ...resources.options,
      ]
    : resources.options

  const providerOptions: SelectOption[] = resource.providers.map(
    (provider) => ({ value: String(provider.id), label: provider.name }),
  )

  const showProviderSelect =
    !isSuperAdmin && isPrefix && providerOptions.length > 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <SearchInput
        value={searchInput}
        onChange={onSearchChange}
        onClear={onSearchClear}
        placeholder="Search by email or role..."
        className="mb-0! flex-1 max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-2">
        <SelectDropdown
          value={resource.type}
          onChange={resource.onTypeChange}
          options={typeOptions}
          placeholder="All resources"
          className="w-44"
        />
        {showProviderSelect && (
          <SelectDropdown
            value={String(resource.providerId ?? '')}
            onChange={resource.onProviderChange}
            options={providerOptions}
            placeholder="Select a provider"
            className="w-48"
          />
        )}
        {resource.type && (
          <SelectDropdown
            value={resource.id}
            onChange={resource.onResourceChange}
            options={resourceOptions}
            selectedLabel={resource.label}
            placeholder={
              resources.isLoading
                ? 'Loading...'
                : isPrefix
                  ? 'Select a prefix'
                  : 'Select a provider'
            }
            searchable
            listSize="lg"
            onSearchChange={resources.onSearchChange}
            onScrollEnd={resources.onScrollEnd}
            footer={resources.footer}
            className="w-56"
          />
        )}
      </div>
    </div>
  )
}

export default InvitationsFilters
