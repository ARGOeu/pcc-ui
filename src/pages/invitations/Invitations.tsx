import { useEffect, useState } from 'react'
import { useGetInvitations } from '@/hooks/useInvitations'
import { useAuth } from '@/auth/useAuth'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import InvitationsFilters from './InvitationsFilters'
import InvitationsTable from './InvitationsTable'
import RevokeInvitationDialog from './RevokeInvitationDialog'
import { useInvitationResource } from './useInvitationResource'
import type {
  Invitation,
  InvitationSort,
  InvitationSortField,
} from '@/types/invitations'

const pageSize = 15

const defaultSort: InvitationSort = { field: 'createdAt', order: 'DESC' }

// A column goes to ascending, then descending, then back to the default sort
const getNextSort = (
  current: InvitationSort,
  field: InvitationSortField,
): InvitationSort => {
  if (current.field !== field) {
    return { field, order: 'ASC' }
  }
  if (field === defaultSort.field) {
    return current.order === 'ASC' ? defaultSort : { field, order: 'ASC' }
  }
  return current.order === 'ASC' ? { field, order: 'DESC' } : defaultSort
}

const Invitations = () => {
  const { rolesReady } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<InvitationSort>(defaultSort)
  const [invitationToRevoke, setInvitationToRevoke] =
    useState<Invitation | null>(null)

  const resource = useInvitationResource(() => setCurrentPage(1))

  const { data, isLoading, error } = useGetInvitations(
    currentPage,
    pageSize,
    resource.type || undefined,
    resource.id || undefined,
    searchQuery || undefined,
    sort.field,
    sort.order,
    resource.canLoad && !resource.needsResource,
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  if (!rolesReady) {
    return null
  }

  if (!resource.canLoad) {
    return <Navigate to="/" replace />
  }

  const totalPages = data?.total_pages ?? 0

  const handleSortClick = (field: InvitationSortField) => {
    setSort((prev) => getNextSort(prev, field))
    setCurrentPage(1)
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="page-container">
      <RevokeInvitationDialog
        invitation={invitationToRevoke}
        onClose={() => setInvitationToRevoke(null)}
      />
      <PageHeader
        title="Invitations"
        subtitle="The invitations sent to users and their status"
        className="mb-4"
      >
        <Button href={resource.inviteHref} disabled={!resource.inviteHref}>
          Invite user
        </Button>
      </PageHeader>

      {resource.isLoadingProviders ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : resource.providersError ? (
        <ErrorDisplay
          error={resource.providersError}
          context="providers"
          forbiddenMessage="You have no providers"
        />
      ) : (
        <>
          <InvitationsFilters
            resource={resource}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onSearchClear={handleSearchClear}
          />

          {resource.resources.error ? (
            <ErrorDisplay
              error={resource.resources.error}
              context={resource.isPrefix ? 'prefixes' : 'providers'}
            />
          ) : resource.needsResource ? (
            <EmptyState
              message={`Select a ${
                resource.isPrefix ? 'prefix' : 'provider'
              } to see its invitations`}
            />
          ) : isLoading ? (
            <div className="loading-container">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <ErrorDisplay error={error} context="invitations" />
          ) : (
            <>
              <InvitationsTable
                invitations={data?.content ?? []}
                sort={sort}
                onSortClick={handleSortClick}
                onRevoke={setInvitationToRevoke}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={data?.total_elements ?? 0}
                itemLabel="invitations"
                onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                onNext={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Invitations
