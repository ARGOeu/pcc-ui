import { useState } from 'react'
import {
  useDeleteProviderMutation,
  useGetProviders,
} from '@/hooks/useProviders'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import ConfirmDialog from '@/components/ConfirmDialog'
import ProviderItem from './ProviderItem'
import type { Provider } from '@/types/providers'

const Providers = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(
    null,
  )

  const { data: providers, isLoading, error } = useGetProviders()
  const deleteMutation = useDeleteProviderMutation()

  const handleDeleteClick = (provider: Provider) => {
    setProviderToDelete(provider)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setProviderToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (!providerToDelete) {
      return
    }
    deleteMutation.mutate(
      { id: providerToDelete.id },
      {
        onSuccess: () => {
          toast.success('Provider deleted successfully!')
          setDeleteDialogOpen(false)
          setProviderToDelete(null)
        },
        onError: (err) => {
          toast.error(`Failed to delete provider: ${err.message}`)
        },
      },
    )
  }

  return (
    <div className="page-container">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete provider"
        message={
          <>
            Are you sure you want to delete the provider{' '}
            <strong>{providerToDelete?.name}</strong>?
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
        title="Providers"
        subtitle="The providers registered in the catalogue"
        className="mb-4"
      >
        <Button href="/providers/add">Create provider</Button>
      </PageHeader>

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay
          error={error}
          context="providers"
          forbiddenMessage="You have no providers"
        />
      ) : !providers?.length ? (
        <Card className="px-5 py-8 text-center text-sm italic text-muted">
          No providers found
        </Card>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {providers.map((provider) => (
            <ProviderItem
              key={provider.id}
              provider={provider}
              onDelete={handleDeleteClick}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Providers
