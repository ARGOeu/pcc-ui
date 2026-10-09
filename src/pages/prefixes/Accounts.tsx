import { useEffect, useState } from 'react'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useDeleteAccountMutation, useGetAccounts } from '@/hooks/useAccounts'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
import ConfirmDialog from '@/components/ConfirmDialog'
import AccountRecord from './AccountRecord'
import type { Account } from '@/types/accounts'

const pageSize = 10

const Accounts = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const accountsPath = `/providers/${providerId}/prefixes/${prefixId}/accounts`

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)

  const { data: prefix } = useGetPrefix(providerId, prefixId, !!id)
  const { data, isLoading, error } = useGetAccounts(
    providerId,
    prefixId,
    currentPage,
    pageSize,
    searchQuery || undefined,
  )
  const deleteMutation = useDeleteAccountMutation()

  const accounts = data?.content ?? []
  const totalPages = data?.total_pages ?? 0
  const totalElements = data?.total_elements ?? 0
  const showSearch = Boolean(searchQuery) || isLoading || totalElements > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleDelete = (account: Account) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setAccountToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (!accountToDelete) {
      return
    }
    deleteMutation.mutate(
      { providerId, prefixId, accountId: accountToDelete.id },
      {
        onSuccess: () => {
          toast.success('Account deleted successfully!')
          setDeleteDialogOpen(false)
          setAccountToDelete(null)
          if (accounts.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
          }
        },
        onError: (err) => {
          toast.error(`Failed to delete account: ${err.message}`)
        },
      },
    )
  }

  return (
    <div className="page-container">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete account"
        message={
          <>
            Are you sure you want to delete the account{' '}
            <strong>{accountToDelete?.email}</strong>?
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
        title="Prefix Accounts"
        subtitle={
          <>
            Handle service accounts for prefix{' '}
            {prefix?.name && (
              <strong className="font-mono">{prefix.name}</strong>
            )}
          </>
        }
        navigateTo={{
          label: 'Back to prefixes',
          to: `/prefixes?provider=${providerId}`,
        }}
        className="mb-4"
      >
        <Button href={`${accountsPath}/add`}>Add account</Button>
      </PageHeader>

      {showSearch && (
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onClear={handleSearchClear}
          placeholder="Search by email or endpoint..."
          className="mb-0! max-w-xs"
        />
      )}

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="accounts" />
      ) : accounts.length > 0 ? (
        <>
          <div className="mt-3 flex flex-col gap-4">
            {accounts.map((account) => (
              <AccountRecord
                key={account.id}
                account={account}
                prefixName={prefix?.name}
                editHref={`${accountsPath}/${account.id}/edit`}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="accounts"
            onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </>
      ) : (
        <div className="rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs mt-3">
          <p className="text-sm italic text-muted">
            {searchQuery
              ? 'No accounts match your search'
              : 'No accounts for this prefix found'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Accounts
