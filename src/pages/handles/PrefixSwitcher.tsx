import { useEffect, useState } from 'react'
import { useGetAllPrefixes } from '@/hooks/useAdmin'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { useNavigate } from 'react-router-dom'
import SelectDropdown from '@/components/SelectDropdown'
import type { SelectOption } from '@/components/SelectDropdown'
import type { Prefix } from '@/types/prefixes'

const pageSize = 20
const allProviders = 'all'

const getOptionValue = (prefix: Prefix) => `${prefix.provider_id}/${prefix.id}`

interface PrefixSwitcherProps {
  providerId: number
  prefixId: number
}

const PrefixSwitcher = ({ providerId, prefixId }: PrefixSwitcherProps) => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState(String(providerId))

  const { data: currentPrefix } = useGetPrefix(providerId, prefixId, true)
  const { data: providers, error: providersError } = useGetProviders()

  const showProviderSelect = (providers?.length ?? 0) > 1
  const providerName = showProviderSelect
    ? providers?.find((provider) => String(provider.id) === providerFilter)
        ?.name
    : undefined

  const {
    data: prefixes,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPrefixes(
    pageSize,
    searchQuery || undefined,
    providerName,
    !!providers || !!providersError,
  )

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // The provider name is left out when the list holds one provider only
  const getOptionLabel = (prefix: Prefix) =>
    prefix.provider_name && !providerName
      ? `${prefix.name} · ${prefix.provider_name}`
      : prefix.name

  const providerOptions: SelectOption[] = [
    { value: allProviders, label: 'All providers' },
    ...(providers?.map((provider) => ({
      value: String(provider.id),
      label: provider.name,
    })) ?? []),
  ]

  const listed = prefixes?.pages.flatMap((page) => page.content) ?? []
  const options: SelectOption[] = listed.map((prefix) => ({
    value: getOptionValue(prefix),
    label: getOptionLabel(prefix),
  }))

  const totalElements = prefixes?.pages.at(-1)?.total_elements ?? 0

  const handleScrollEnd = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  const handleChange = (value: string) => {
    const [selectedProviderId, selectedPrefixId] = value.split('/')
    void navigate(
      `/providers/${selectedProviderId}/prefixes/${selectedPrefixId}/handles`,
    )
  }

  return (
    <div className="flex w-full max-w-2xl flex-wrap gap-x-3 gap-y-2">
      {showProviderSelect && (
        <div className="flex w-full flex-col sm:w-44">
          <label className="text-sm font-medium text-body mb-0.5">
            Select a provider:
          </label>
          <SelectDropdown
            value={providerFilter}
            onChange={setProviderFilter}
            options={providerOptions}
            placeholder="Select a provider..."
          />
        </div>
      )}
      <div className="flex w-full flex-col sm:w-80">
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
          listSize="lg"
          onSearchChange={setSearchInput}
          onScrollEnd={handleScrollEnd}
          footer={
            isLoading
              ? 'Loading prefixes...'
              : isFetchingNextPage
                ? 'Loading more prefixes...'
                : totalElements > listed.length
                  ? `Showing ${listed.length} of ${totalElements} prefixes`
                  : undefined
          }
        />
      </div>
    </div>
  )
}

export default PrefixSwitcher
