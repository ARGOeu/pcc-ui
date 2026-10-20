import { useEffect, useState } from 'react'
import { useGetAllPrefixes } from '@/hooks/useAdmin'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useNavigate } from 'react-router-dom'
import SelectDropdown from '@/components/SelectDropdown'
import type { SelectOption } from '@/components/SelectDropdown'
import type { Prefix } from '@/types/prefixes'

const pageSize = 20

const getOptionValue = (prefix: Prefix) => `${prefix.provider_id}/${prefix.id}`

const getOptionLabel = (prefix: Prefix) =>
  prefix.provider_name
    ? `${prefix.name} · ${prefix.provider_name}`
    : prefix.name

interface PrefixSwitcherProps {
  providerId: number
  prefixId: number
}

const PrefixSwitcher = ({ providerId, prefixId }: PrefixSwitcherProps) => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: currentPrefix } = useGetPrefix(providerId, prefixId, true)
  const { data: prefixes } = useGetAllPrefixes(
    1,
    pageSize,
    undefined,
    undefined,
    undefined,
    searchQuery || undefined,
  )

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const listed = prefixes?.content ?? []
  const options: SelectOption[] = listed.map((prefix) => ({
    value: getOptionValue(prefix),
    label: getOptionLabel(prefix),
  }))

  const totalElements = prefixes?.total_elements ?? 0

  const handleChange = (value: string) => {
    const [selectedProviderId, selectedPrefixId] = value.split('/')
    void navigate(
      `/providers/${selectedProviderId}/prefixes/${selectedPrefixId}/handles`,
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col">
      <label className="text-sm font-medium text-body mb-0.5">
        Select a prefix:
      </label>
      <SelectDropdown
        value={`${providerId}/${prefixId}`}
        onChange={handleChange}
        options={options}
        selectedLabel={currentPrefix && getOptionLabel(currentPrefix)}
        placeholder="Select a prefix..."
        searchable
        onSearchChange={setSearchInput}
        footer={
          totalElements > listed.length
            ? `Showing ${listed.length} of ${totalElements} prefixes`
            : undefined
        }
      />
    </div>
  )
}

export default PrefixSwitcher
