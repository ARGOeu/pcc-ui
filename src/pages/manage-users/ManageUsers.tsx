import { useEffect, useState } from 'react'
import { useGetMembers } from '@/hooks/useMembers'
import { useAuth } from '@/auth/useAuth'
import { PREFIX_RESOURCE, PROVIDER_RESOURCE } from '@/auth/roles'
import { Navigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import SelectDropdown from '@/components/SelectDropdown'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import Pagination from '@/components/Pagination'
import MembersTable from './MembersTable'
import RevokeRoleDialog from './RevokeRoleDialog'
import type { SelectOption } from '@/components/SelectDropdown'
import type { MembershipToRevoke } from '@/types/members'

const pageSize = 10

const resourceTypeOptions: SelectOption[] = [
  { value: '', label: 'All resources' },
  { value: PROVIDER_RESOURCE, label: 'Providers' },
  { value: PREFIX_RESOURCE, label: 'Prefixes' },
]

const ManageUsers = () => {
  const { rolesReady, isSuperAdmin } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [resourceType, setResourceType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [roleToRevoke, setRoleToRevoke] = useState<MembershipToRevoke | null>(
    null,
  )

  const { data, isLoading, error } = useGetMembers(
    currentPage,
    pageSize,
    resourceType || undefined,
    searchQuery || undefined,
    isSuperAdmin,
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

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  const totalPages = data?.total_pages ?? 0

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleResourceTypeChange = (value: string) => {
    setResourceType(value)
    setCurrentPage(1)
  }

  const handleRevoked = ({ member }: MembershipToRevoke) => {
    const shownRoles = Object.values(member.memberships).flat().length
    if (data?.content.length === 1 && shownRoles === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className="page-container">
      <RevokeRoleDialog
        target={roleToRevoke}
        onClose={() => setRoleToRevoke(null)}
        onRevoked={handleRevoked}
      />
      <PageHeader
        title="Manage users"
        subtitle="The users of the application and their roles"
        className="mb-4"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onClear={handleSearchClear}
          placeholder="Search by name, username or email..."
          className="mb-0! flex-1 max-w-xs"
        />
        <SelectDropdown
          value={resourceType}
          onChange={handleResourceTypeChange}
          options={resourceTypeOptions}
          placeholder="All resources"
          className="w-44"
        />
      </div>

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="users" />
      ) : (
        <>
          <MembersTable
            members={data?.content ?? []}
            onRevoke={setRoleToRevoke}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={data?.total_elements ?? 0}
            itemLabel="users"
            onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </>
      )}
    </div>
  )
}

export default ManageUsers
