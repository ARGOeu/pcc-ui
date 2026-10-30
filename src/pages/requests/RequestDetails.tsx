import { useState } from 'react'
import {
  useAssignRequestProviderMutation,
  useGetPrefixRequest,
  useGetProviderPrefixRequests,
  useUpdateRequestStatusMutation,
} from '@/hooks/usePrefixRequests'
import { useGetProviders } from '@/hooks/useProviders'
import { useAuth } from '@/auth/useAuth'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import capitalizeWord from '@/utils/capitalizeWord'
import { statusBadgeClass } from '@/utils/prefixRequests'
import ReviewResultCard from './ReviewResultCard'
import ReviewDialog from './ReviewDialog'
import RequestInfo from './RequestInfo'
import ReviewCard from './ReviewCard'
import type { PrefixRequestReviewResult } from '@/types/prefixRequests'

const RequestDetails = () => {
  const { id } = useParams<{ id: string }>()
  const requestId = Number(id)
  const { isSuperAdmin, isProviderAdmin, rolesReady } = useAuth()
  const isProviderOnly = isProviderAdmin && !isSuperAdmin
  const isMember = !isSuperAdmin && !isProviderAdmin

  const [reviewResult, setReviewResult] =
    useState<PrefixRequestReviewResult | null>(null)

  // The backend does not let a provider admin open the details of a single
  // request by its id, so use the assigned list and keep only accepted ones
  const detail = useGetPrefixRequest(requestId, rolesReady && !isProviderOnly)
  const assigned = useGetProviderPrefixRequests(rolesReady && isProviderOnly)
  const request = isProviderOnly
    ? assigned.data?.find(
        (item) => item.id === requestId && item.status === 'ACCEPTED',
      )
    : detail.data
  const isLoading = isProviderOnly ? assigned.isLoading : detail.isLoading
  const error = isProviderOnly ? assigned.error : detail.error
  const { data: providers } = useGetProviders(isSuperAdmin)
  const statusMutation = useUpdateRequestStatusMutation()
  const assignMutation = useAssignRequestProviderMutation()

  const isPending = request?.status === 'PENDING'
  const canEdit = !isProviderOnly && isPending

  const handleReviewConfirm = (reason: string, providerId?: number) => {
    if (!reviewResult) {
      return
    }
    const accepted = reviewResult === 'ACCEPTED'
    const submitReview = () => {
      statusMutation.mutate(
        {
          id: requestId,
          data: { status: reviewResult, status_reason: reason },
        },
        {
          onSuccess: () => {
            toast.success(
              accepted
                ? 'Request accepted successfully!'
                : 'Request rejected successfully!',
            )
            setReviewResult(null)
          },
          onError: (err) => {
            toast.error(
              `Failed to ${accepted ? 'accept' : 'reject'} request: ${err.message}`,
            )
          },
        },
      )
    }

    // Accepting is two calls: assign the chosen provider, then set the status.
    if (providerId && providerId !== request?.provider_id) {
      assignMutation.mutate(
        { id: requestId, providerId },
        {
          onSuccess: submitReview,
          onError: (err) => {
            toast.error(`Failed to assign provider: ${err.message}`)
          },
        },
      )
    } else {
      submitReview()
    }
  }

  const side = !request ? null : isSuperAdmin && isPending ? (
    <ReviewCard onReview={setReviewResult} />
  ) : !isMember && !isPending ? (
    <ReviewResultCard request={request} />
  ) : null

  return (
    <div className="page-container">
      {reviewResult && request && (
        <ReviewDialog
          result={reviewResult}
          request={request}
          providers={providers}
          isPending={statusMutation.isPending || assignMutation.isPending}
          onConfirm={handleReviewConfirm}
          onCancel={() => setReviewResult(null)}
        />
      )}

      <PageHeader
        title={
          request ? (
            <span className="flex flex-wrap items-center gap-3">
              {request.project_name}
              <Badge size="md" className={statusBadgeClass[request.status]}>
                {capitalizeWord(request.status)}
              </Badge>
            </span>
          ) : (
            'Request details'
          )
        }
        subtitle={
          request &&
          (isSuperAdmin && isPending
            ? 'Check the details, then accept or reject the request'
            : 'Details of the request for a new prefix')
        }
        navigateTo={{
          label: isMember ? 'Back to my requests' : 'Back to requests',
          to: '/requests',
        }}
        className="mb-4"
      >
        {request && canEdit && (
          <Button
            variant="outline-secondary"
            href={`/requests/${request.id}/edit`}
          >
            Edit request
          </Button>
        )}
      </PageHeader>

      {!rolesReady || isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="request" />
      ) : request ? (
        side ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem] gap-4 items-start">
            <RequestInfo request={request} showReviewResult={isMember} />
            {side}
          </div>
        ) : (
          <RequestInfo request={request} showReviewResult={isMember} />
        )
      ) : (
        <EmptyState message="This request was not found" className="mt-3" />
      )}
    </div>
  )
}

export default RequestDetails
