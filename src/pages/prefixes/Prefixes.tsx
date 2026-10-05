import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetPrefixes, useDeletePrefixMutation } from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { useGetDomains } from '@/hooks/useDomains'
import { useGetContractTypes } from '@/hooks/useCodelist'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import SelectDropdown from '@/components/SelectDropdown'
import Tabs from '@/components/Tabs'
import ConfirmDialog from '@/components/ConfirmDialog'
import capitalizeWord from '@/utils/capitalizeWord'
import PrefixesTable from './PrefixesTable'
import type { Prefix } from '@/types/prefixes'

const pageSize = 10

const Prefixes = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [domainFilter, setDomainFilter] = useState('')
  const [contractTypeFilter, setContractTypeFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [prefixToDelete, setPrefixToDelete] = useState<Prefix | null>(null)

  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useGetProviders()
  const providerParam = Number(searchParams.get('provider'))
  const activeProvider =
    providers?.find((provider) => provider.id === providerParam) ??
    providers?.[0]
  const { data, isLoading, error } = useGetPrefixes(
    activeProvider?.id ?? 0,
    currentPage,
    pageSize,
    domainFilter || undefined,
    activeProvider?.name,
    contractTypeFilter || undefined,
    searchQuery || undefined,
    !!activeProvider,
  )
  const { data: domains } = useGetDomains()
  const { data: contractTypes } = useGetContractTypes()
  const deleteMutation = useDeletePrefixMutation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleProviderTabChange = (providerId: string) => {
    setSearchParams({ provider: providerId }, { replace: true })
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

  const handleDelete = (prefix: Prefix) => {
    setPrefixToDelete(prefix)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setPrefixToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (!prefixToDelete) {
      return
    }
    deleteMutation.mutate(
      { providerId: prefixToDelete.provider_id, id: prefixToDelete.id },
      {
        onSuccess: () => {
          toast.success('Prefix deleted successfully!')
          setDeleteDialogOpen(false)
          setPrefixToDelete(null)
          if (prefixes.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
          }
        },
        onError: (error) => {
          toast.error(`Failed to delete prefix: ${error.message}`)
        },
      },
    )
  }

  const prefixes = data?.content ?? []
  const totalPages = data?.total_pages ?? 0
  const totalElements = data?.total_elements ?? 0
  const hasActiveFilters = Boolean(
    domainFilter || contractTypeFilter || searchQuery,
  )
  const emptyMessage = hasActiveFilters
    ? 'No prefixes match your filters'
    : 'No prefixes found'

  const providerTabs =
    providers?.map((provider) => ({
      id: String(provider.id),
      label: provider.name,
    })) ?? []

  const domainOptions = [
    { value: '', label: 'All domains' },
    ...(domains?.map((domain) => ({
      value: domain.name,
      label: capitalizeWord(domain.name),
    })) ?? []),
  ]

  const contractTypeOptions = [
    { value: '', label: 'All contract types' },
    ...(contractTypes?.map((contractType) => ({
      value: contractType.name,
      label: capitalizeWord(contractType.name),
    })) ?? []),
  ]

  return (
    <div className="page-container">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete prefix"
        message={
          <>
            Are you sure you want to delete the prefix{' '}
            <strong>{prefixToDelete?.name}</strong>?
            <br />
            <span className="text-amber-600 font-medium">
              This action cannot be undone.
            </span>
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <PageHeader
        title="Prefixes"
        subtitle="Browse the prefixes registered in the catalogue"
        className="mb-4"
      >
        <Button
          variant="primary"
          disabled={!activeProvider}
          onClick={() =>
            void navigate(`/providers/${activeProvider?.id}/prefixes/add`)
          }
        >
          Create prefix
        </Button>
      </PageHeader>
      {isLoadingProviders ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : providersError ? (
        <ErrorDisplay error={providersError} context="providers" />
      ) : (
        <>
          <Tabs
            tabs={providerTabs}
            activeTab={String(activeProvider?.id ?? '')}
            onChange={handleProviderTabChange}
            className="mb-3"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onClear={handleSearchClear}
              placeholder="Search by name or owner..."
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
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <ErrorDisplay error={error} context="prefixes" />
          ) : (
            <>
              <PrefixesTable
                prefixes={prefixes}
                emptyMessage={emptyMessage}
                onDelete={handleDelete}
              />
              {totalElements > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  itemLabel="prefixes"
                  onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  onNext={() => setCurrentPage((prev) => prev + 1)}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Prefixes
