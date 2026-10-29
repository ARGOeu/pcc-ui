import { useState } from 'react'
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
import type { PrefixRequest } from '@/types/prefixRequests'

const pageSize = 10

type StatusFilter = 'pending' | 'accepted' | 'rejected'

const defaultFilter: StatusFilter = 'pending'

const filterLabels: Record<StatusFilter, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

const isStatusFilter = (value: string | null): value is StatusFilter =>
  value !== null && Object.keys(filterLabels).includes(value)

const matchesSearch = (request: PrefixRequest, query: string): boolean =>
  [
    request.project_name,
    request.organization_name,
    `${request.contact_person_name} ${request.contact_person_surname}`,
    request.contact_person_email,
  ].some((value) => value.toLowerCase().includes(query))

const Requests = () => {
  const { isSuperAdmin, isProviderAdmin, rolesReady } = useAuth()
  const isProviderOnly = isProviderAdmin && !isSuperAdmin
  const isMember = !isSuperAdmin && !isProviderAdmin
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<PrefixRequest | null>(
    null,
  )

  const allRequests = useGetPrefixRequests(rolesReady && !isProviderOnly)
  const providerRequests = useGetProviderPrefixRequests(
    rolesReady && isProviderOnly,
  )
  const { data, isLoading, error } = isProviderOnly
    ? providerRequests
    : allRequests
  const deleteMutation = useDeletePrefixRequestMutation()

  const statusParam = searchParams.get('status')
  const activeFilter: StatusFilter = isStatusFilter(statusParam)
    ? statusParam
    : defaultFilter

  // A provider admin sees a request only after a super admin accepted it.
  const requests = [...(data ?? [])]
    .filter((request) => !isProviderOnly || request.status === 'ACCEPTED')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

  const query = searchQuery.trim().toLowerCase()

  const filteredRequests = requests.filter(
    (request) =>
      (!isSuperAdmin || request.status.toLowerCase() === activeFilter) &&
      (!query || matchesSearch(request, query)),
  )
  const totalPages = Math.ceil(filteredRequests.length / pageSize)
  const pageRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const tabs = (Object.keys(filterLabels) as StatusFilter[]).map((filter) => ({
    id: filter,
    label: filterLabels[filter],
    count: requests.filter((request) => request.status.toLowerCase() === filter)
      .length,
  }))

  const handleFilterChange = (id: string) => {
    if (isStatusFilter(id)) {
      setSearchParams(id === defaultFilter ? {} : { status: id })
      setCurrentPage(1)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
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
        if (pageRequests.length === 1 && currentPage > 1) {
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

  const emptyMessage = query
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
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange('')}
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
      ) : pageRequests.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {pageRequests.map((request) => (
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
            totalElements={filteredRequests.length}
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
