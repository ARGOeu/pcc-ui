import { useId, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/16/solid'
import Button from '@/components/Button'
import SelectDropdown from '@/components/SelectDropdown'
import LoadingSpinner from '@/components/LoadingSpinner'
import type {
  PrefixRequest,
  PrefixRequestReviewResult,
} from '@/types/prefixRequests'
import type { Provider } from '@/types/providers'

const resultText: Record<
  PrefixRequestReviewResult,
  { title: string; confirm: string }
> = {
  ACCEPTED: { title: 'Accept request', confirm: 'Accept' },
  REJECTED: { title: 'Reject request', confirm: 'Reject' },
}

interface ReviewDialogProps {
  result: PrefixRequestReviewResult
  request: PrefixRequest
  providers?: Provider[]
  isPending: boolean
  onConfirm: (reason: string, providerId?: number) => void
  onCancel: () => void
}

const ReviewDialog = ({
  result,
  request,
  providers,
  isPending,
  onConfirm,
  onCancel,
}: ReviewDialogProps) => {
  const reasonId = useId()
  const [reason, setReason] = useState('')
  const [providerId, setProviderId] = useState(
    request.provider_id ? String(request.provider_id) : '',
  )
  const { title, confirm } = resultText[result]
  const isAccept = result === 'ACCEPTED'
  const canConfirm = !!reason.trim() && (!isAccept || !!providerId)

  const handleConfirm = () => {
    onConfirm(reason.trim(), isAccept ? Number(providerId) : undefined)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4"
      onClick={isPending ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-labelledby={`${reasonId}-title`}
        className="bg-white rounded-lg shadow-xl max-w-120 w-full overflow-hidden mb-32"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
          <h3
            id={`${reasonId}-title`}
            className="text-xl font-semibold text-foreground m-0"
          >
            {title}
          </h3>
          <button
            type="button"
            className="p-1 rounded-full text-muted bg-transparent border-none cursor-pointer transition-colors hover:bg-surface-strong hover:text-foreground"
            onClick={onCancel}
            aria-label="Close dialog"
            disabled={isPending}
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="px-5 py-3">
          <p className="text-base text-muted leading-snug">
            {isAccept ? 'Accept' : 'Reject'} the request{' '}
            <strong>{request.project_name}</strong> from{' '}
            <strong>{request.organization_name}</strong>?{' '}
            {isAccept
              ? 'Choose a provider for this request and write a reason that the requester can read.'
              : 'The requester can read your reason.'}
          </p>

          {isAccept && (
            <div className="mt-2 flex flex-col">
              <label className="text-sm font-medium text-body mb-0.5">
                Provider <span className="required">*</span>
              </label>
              <SelectDropdown
                value={providerId}
                onChange={setProviderId}
                options={(providers ?? []).map((provider) => ({
                  value: String(provider.id),
                  label: provider.name,
                }))}
                placeholder="Select a provider..."
                disabled={isPending}
              />
            </div>
          )}

          <div className="mt-2 flex flex-col">
            <label
              htmlFor={reasonId}
              className="text-sm font-medium text-body mb-0.5"
            >
              Reason <span className="required">*</span>
            </label>
            <textarea
              id={reasonId}
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isAccept
                  ? 'Tell the requester why the request is accepted'
                  : 'Tell the requester why the request is rejected'
              }
              autoFocus={!isAccept || !!request.provider_id}
            />
          </div>
        </div>

        <div className="flex justify-between gap-6 px-5 py-3 mt-2 bg-surface-muted border-t border-line">
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <LoadingSpinner size="xs" />
                {confirm}...
              </span>
            ) : (
              confirm
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReviewDialog
