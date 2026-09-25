import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAllPrefixes } from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { useGetDomains } from '@/hooks/useDomains'
import { useGetContractTypes } from '@/hooks/useCodelist'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import SelectDropdown from '@/components/SelectDropdown'
import Tabs from '@/components/Tabs'
import PrefixesTable from './PrefixesTable'
import capitalizeWord from '@/utils/capitalizeWord'

const pageSize = 10

const Prefixes = () => {
  const navigate = useNavigate()

  const [activeProviderId, setActiveProviderId] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [contractTypeFilter, setContractTypeFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useGetAllPrefixes()
  const { data: providers } = useGetProviders()
  const { data: domains } = useGetDomains()
  const { data: contractTypes } = useGetContractTypes()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleProviderTabChange = (id: string) => {
    setActiveProviderId(id)
    setCurrentPage(1)
  }

  const handleDomainChange = (value: string) => {
    setDomainFilter(value)
    setCurrentPage(1)
  }

  const handleContractTypeChange = (value: string) => {
    setContractTypeFilter(value)
    setCurrentPage(1)
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const filtered = data.filter((prefix) => {
    if (activeProviderId && String(prefix.provider_id) !== activeProviderId) {
      return false
    }
    if (domainFilter && String(prefix.domain_id) !== domainFilter) {
      return false
    }
    if (
      contractTypeFilter &&
      String(prefix.contract_type_id) !== contractTypeFilter
    ) {
      return false
    }
    if (!searchQuery) {
      return true
    }
    const query = searchQuery.toLowerCase()
    return (
      prefix.name.toLowerCase().includes(query) ||
      prefix.owner.toLowerCase().includes(query) ||
      (prefix.provider_name ?? '').toLowerCase().includes(query) ||
      (prefix.service_name ?? '').toLowerCase().includes(query) ||
      (prefix.domain_name ?? '').toLowerCase().includes(query) ||
      (prefix.contract_type_name ?? '').toLowerCase().includes(query)
    )
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const emptyMessage =
    data.length > 0 && filtered.length === 0
      ? 'No prefixes match your filters'
      : 'No prefixes found'

  const providerTabs = [
    { id: '', label: 'All' },
    ...(providers?.map((provider) => ({
      id: String(provider.id),
      label: provider.name,
    })) ?? []),
  ]

  const domainOptions = [
    { value: '', label: 'All domains' },
    ...(domains?.map((domain) => ({
      value: String(domain.id),
      label: capitalizeWord(domain.name),
    })) ?? []),
  ]

  const contractTypeOptions = [
    { value: '', label: 'All contract types' },
    ...(contractTypes?.map((contractType) => ({
      value: String(contractType.id),
      label: capitalizeWord(contractType.name),
    })) ?? []),
  ]

  return (
    <div className="page-container">
      <PageHeader
        title="Prefixes"
        subtitle="Browse the prefixes registered in the catalogue"
        className="mb-4"
      >
        <Button
          variant="primary"
          onClick={() => void navigate('/prefixes/add')}
        >
          Create prefix
        </Button>
      </PageHeader>
      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="prefixes" />
      ) : (
        <>
          <Tabs
            tabs={providerTabs}
            activeTab={activeProviderId}
            onChange={handleProviderTabChange}
            className="mb-3"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onClear={handleSearchClear}
              placeholder="Search by name, owner, provider..."
              className="mb-0! flex-1 max-w-xs"
            />
            <div className="flex items-center gap-2">
              <SelectDropdown
                value={domainFilter}
                onChange={handleDomainChange}
                options={domainOptions}
                placeholder="All domains"
                className="w-48"
                searchable
              />
              <SelectDropdown
                value={contractTypeFilter}
                onChange={handleContractTypeChange}
                options={contractTypeOptions}
                placeholder="All contract types"
                className="w-48"
              />
            </div>
          </div>
          <PrefixesTable prefixes={paginated} emptyMessage={emptyMessage} />
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={filtered.length}
              itemLabel="prefixes"
              onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setCurrentPage((prev) => prev + 1)}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Prefixes
