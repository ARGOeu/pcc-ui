import { useEffect, useState } from 'react'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useDeleteHandleMutation, useGetHandles } from '@/hooks/useHandles'
import { useHandleAccess } from '@/auth/useHandleAccess'
import { isTokenRejected } from '@/api/handles'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LockClosedIcon } from '@heroicons/react/16/solid'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
import ConfirmDialog from '@/components/ConfirmDialog'
import PrefixSwitcher from './PrefixSwitcher'
import AuthorizeDialog from './AuthorizeDialog'
import AuthorizedAccount from './AuthorizedAccount'
import HandlesList from './HandlesList'
import { getHandleSuffix } from '@/utils/handleValues'
import { setLastHandlesPrefix } from '@/utils/lastHandlesPrefix'
import type { HandleAccess } from '@/types/handles'

const pageSize = 25

interface HandlesViewProps {
  providerId: number
  prefixId: number
}

const HandlesView = ({ providerId, prefixId }: HandlesViewProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [authorizeDialogOpen, setAuthorizeDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [handleToDelete, setHandleToDelete] = useState<string | null>(null)
  const [hasPrefixSelected, setHasPrefixSelected] = useState(true)
  const handlesPath = `/providers/${providerId}/prefixes/${prefixId}/handles`

  const { access, setAccess, clearAccess } = useHandleAccess(prefixId)
  const { data: prefix, error: prefixError } = useGetPrefix(
    providerId,
    prefixId,
    true,
  )
  const { data, isLoading, error } = useGetHandles(
    providerId,
    prefixId,
    access,
    currentPage,
    pageSize,
    searchQuery || undefined,
  )
  const deleteMutation = useDeleteHandleMutation()

  const handles = data?.content ?? []
  const totalPages = data?.total_pages ?? 0
  const totalElements = data?.total_elements ?? 0
  const tokenRejected = isTokenRejected(error)
  const showHandles =
    !!access && !tokenRejected && !prefixError && hasPrefixSelected

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    if (prefix) {
      setLastHandlesPrefix({ providerId, prefixId })
    }
  }, [prefix, providerId, prefixId])

  const handleSearchClear = () => {
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleAuthorized = (newAccess: HandleAccess) => {
    setAccess(newAccess)
    setAuthorizeDialogOpen(false)
  }

  const handleDelete = (handle: string) => {
    setHandleToDelete(handle)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setHandleToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (!access || !handleToDelete) {
      return
    }
    deleteMutation.mutate(
      {
        providerId,
        prefixId,
        suffix: getHandleSuffix(handleToDelete),
        access,
      },
      {
        onSuccess: () => {
          toast.success('Handle deleted successfully!')
          setDeleteDialogOpen(false)
          setHandleToDelete(null)
          if (handles.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
          }
        },
        onError: (err) => {
          toast.error(`Failed to delete handle: ${err.message}`)
        },
      },
    )
  }

  return (
    <div className="page-container">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete handle"
        message={
          <>
            Are you sure you want to delete the handle{' '}
            <strong className="font-mono">{handleToDelete}</strong>?
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
        title="Handles"
        subtitle="The handles of the selected prefix"
        className="mb-2"
      >
        {hasPrefixSelected &&
          (access ? (
            <Button
              href={`/providers/${providerId}/prefixes/${prefixId}/create-handle`}
            >
              Create handle
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              onClick={() => setAuthorizeDialogOpen(true)}
            >
              Authorise
            </Button>
          ))}
      </PageHeader>

      {showHandles && access && (
        <AuthorizedAccount
          access={access}
          onChangeAccount={() => setAuthorizeDialogOpen(true)}
          onForgetToken={clearAccess}
          className="mb-3"
        />
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <PrefixSwitcher
          providerId={providerId}
          prefixId={prefixId}
          hasSelection={hasPrefixSelected}
          onHasSelectionChange={setHasPrefixSelected}
        />
        {showHandles && (
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onClear={handleSearchClear}
            placeholder="Search by handle name..."
            maxWidth="max-w-none"
            className="w-full sm:w-80 mb-0!"
          />
        )}
      </div>
      <div className="mt-3">
        {!hasPrefixSelected ? (
          <div className="rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs">
            <p className="text-sm italic text-muted">
              Select a prefix to see its handles
            </p>
          </div>
        ) : prefixError ? (
          <ErrorDisplay
            error={prefixError}
            context="prefix"
            forbiddenMessage="You have no access to the handles of this prefix"
          />
        ) : !access || tokenRejected ? (
          <>
            {tokenRejected && access && (
              <div
                role="alert"
                className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500 bg-amber-100 px-3 py-2 text-sm text-amber-700"
              >
                <span className="flex items-center gap-2">
                  <LockClosedIcon className="size-4 shrink-0" />
                  {error?.message} Enter the token of{' '}
                  <strong className="font-mono font-medium">
                    {access.account.username}
                  </strong>{' '}
                  again to continue
                </span>
                <Button size="xs" onClick={() => setAuthorizeDialogOpen(true)}>
                  Authorise
                </Button>
              </div>
            )}
            <div className="rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs">
              <p className="text-sm italic text-muted">
                Authorise with a Handle service account to see the handles of
                this prefix
              </p>
            </div>
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="loading-container">
                <LoadingSpinner size="md" />
              </div>
            ) : error ? (
              <ErrorDisplay error={error} context="handles" />
            ) : (
              <>
                <HandlesList
                  handles={handles}
                  prefixName={prefix?.name}
                  totalElements={totalElements}
                  searchTerm={searchQuery}
                  handlesPath={handlesPath}
                  onDelete={handleDelete}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  itemLabel="handles"
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

      {authorizeDialogOpen && (
        <AuthorizeDialog
          providerId={providerId}
          prefixId={prefixId}
          onAuthorized={handleAuthorized}
          onClose={() => setAuthorizeDialogOpen(false)}
        />
      )}
    </div>
  )
}

const Handles = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)

  return (
    <HandlesView
      key={`${providerId}/${prefixId}`}
      providerId={providerId}
      prefixId={prefixId}
    />
  )
}

export default Handles
