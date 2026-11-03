import { useEffect, useState } from 'react'
import {
  useDeletePrefixRequestMutation,
  useGetPrefixRequests,
  useGetProviderPrefixRequests,
} from '@/hooks/usePrefixRequests'
import { useAuth } from '@/auth/useAuth'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Tabs from '@/components/Tabs'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
import ConfirmDialog from '@/components/ConfirmDialog'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import RequestCard from './RequestCard'
import type { PrefixRequest, PrefixRequestStatus } from '@/types/prefixRequests'

const pageSize = 10

type StatusFilter = 'pending' | 'accepted' | 'rejected'

const defaultFilter: StatusFilter = 'pending'

const filterLabels: Record<StatusFilter, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

const filterStatuses: Record<StatusFilter, PrefixRequestStatus> = {
  pending: 'PENDING',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
}

const isStatusFilter = (value: string | null): value is StatusFilter =>
  value !== null && Object.keys(filterLabels).includes(value)

const Requests = () => {
  const { isSuperAdmin, isProviderAdmin, rolesReady } = useAuth()
  const isProviderOnly = isProviderAdmin && !isSuperAdmin
  const isMember = !isSuperAdmin && !isProviderAdmin
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<PrefixRequest | null>(
    null,
  )

  const statusParam = searchParams.get('status')
  const activeFilter: StatusFilter = isStatusFilter(statusParam)
    ? statusParam
    : defaultFilter

  // A provider admin sees a request only after a super admin accepted it
  const status = isSuperAdmin
    ? filterStatuses[activeFilter]
    : isProviderOnly
      ? 'ACCEPTED'
      : undefined

  const allRequests = useGetPrefixRequests(
    currentPage,
    pageSize,
    searchQuery || undefined,
    status,
    rolesReady && !isProviderOnly,
  )
  const providerRequests = useGetProviderPrefixRequests(
    currentPage,
    pageSize,
    searchQuery || undefined,
    status,
    rolesReady && isProviderOnly,
  )
  const { data, isLoading, error } = isProviderOnly
    ? providerRequests
    : allRequests
  const deleteMutation = useDeletePrefixRequestMutation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const requests = data?.content ?? []
  const totalPages = data?.total_pages ?? 0
  const totalElements = data?.total_elements ?? 0

  const tabs = (Object.keys(filterLabels) as StatusFilter[]).map((filter) => ({
    id: filter,
    label: filterLabels[filter],
  }))

  const handleFilterChange = (id: string) => {
    if (isStatusFilter(id)) {
      setSearchParams(id === defaultFilter ? {} : { status: id })
      setCurrentPage(1)
    }
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleDelete = (request: PrefixRequest) => {
    setRequestToDelete(request)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!requestToDelete) {
      return
    }
    deleteMutation.mutate(requestToDelete.id, {
      onSuccess: () => {
        toast.success('Request deleted successfully!')
        if (requests.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1)
        }
        setDeleteDialogOpen(false)
        setRequestToDelete(null)
      },
      onError: (err) => {
        toast.error(`Failed to delete request: ${err.message}`)
      },
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setRequestToDelete(null)
  }

  const emptyMessage = searchQuery
    ? 'No requests match your search'
    : isMember
      ? 'You have no prefix requests yet. Use Request a prefix to send the first one.'
      : isProviderOnly
        ? 'No accepted requests are assigned to your provider'
        : `There are no ${activeFilter} requests`

  return (
    <div className="page-container">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete request"
        message={
          <>
            Are you sure you want to delete the request{' '}
            <strong>{requestToDelete?.project_name}</strong>?
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
        title={isMember ? 'My requests' : 'Prefix requests'}
        subtitle={
          isMember
            ? 'Your requests for new prefixes and their current status'
            : isSuperAdmin
              ? 'Review the requests for new prefixes and choose a provider for each one you accept'
              : 'Accepted requests for new prefixes that are assigned to your provider'
        }
        className="mb-4"
      >
        {rolesReady && !isProviderOnly && (
          <Button href="/requests/add">Request a prefix</Button>
        )}
      </PageHeader>

      {!isMember && (
        <>
          {isSuperAdmin && (
            <Tabs
              tabs={tabs}
              activeTab={activeFilter}
              onChange={handleFilterChange}
              className="mb-3"
            />
          )}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onClear={handleSearchClear}
            placeholder="Search by project, organisation or contact..."
            maxWidth="max-w-sm"
            className="mb-3"
          />
        </>
      )}

      {!rolesReady || isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="requests" />
      ) : requests.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                variant={
                  isMember ? 'member' : isProviderOnly ? 'provider' : 'admin'
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="requests"
            onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </>
      ) : (
        <EmptyState message={emptyMessage} className="mt-3" />
      )}
    </div>
  )
}

export default Requests
