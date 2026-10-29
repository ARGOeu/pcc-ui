import {
  Bars3Icon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import capitalizeWord from '@/utils/capitalizeWord'
import formatDate from '@/utils/formatDate'
import { expectedHandlesLabels, statusBadgeClass } from '@/utils/prefixRequests'
import type { PrefixRequest } from '@/types/prefixRequests'

const fieldLabelClass = 'text-[13px] text-muted mb-0.5'
const fieldValueClass = 'text-sm text-foreground'

export type RequestCardVariant = 'member' | 'admin' | 'provider'

interface RequestCardProps {
  request: PrefixRequest
  variant: RequestCardVariant
  onDelete?: (request: PrefixRequest) => void
}

const RequestCard = ({ request, variant, onDelete }: RequestCardProps) => {
  const detailsHref = `/requests/${request.id}/details`
  const isPending = request.status === 'PENDING'

  return (
    <article className="flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-line bg-white px-5 py-4 shadow-sm">
      <div className="flex min-w-0 flex-[1_1_22rem] flex-col gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg leading-7 font-semibold text-foreground">
              {request.project_name}
            </h2>
            <Badge size="sm" className={statusBadgeClass[request.status]}>
              {capitalizeWord(request.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted">{request.organization_name}</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-6 gap-y-2">
          {variant !== 'member' && (
            <div className="min-w-0">
              <p className={fieldLabelClass}>Contact</p>
              <p className={fieldValueClass}>
                {request.contact_person_name} {request.contact_person_surname}
              </p>
              <p className="text-xs text-muted break-all">
                {request.contact_person_email}
              </p>
            </div>
          )}
          <div>
            <p className={fieldLabelClass}>Expected handles</p>
            <p className={fieldValueClass}>
              {expectedHandlesLabels[request.expected_handles]}
            </p>
          </div>
          {variant !== 'provider' && (
            <div>
              <p className={fieldLabelClass}>Provider</p>
              <p
                className={
                  request.provider_name ? fieldValueClass : 'text-sm text-muted'
                }
              >
                {request.provider_name ??
                  (isPending ? 'Not assigned yet' : 'Not assigned')}
              </p>
            </div>
          )}
          {!isPending && request.status_reason && (
            <div className="col-span-full">
              <p className={fieldLabelClass}>Reason</p>
              <p className={fieldValueClass}>{request.status_reason}</p>
            </div>
          )}
        </div>
      </div>

      <div className="ml-auto flex shrink-0 flex-col items-end justify-between gap-3">
        {variant === 'admin' && isPending ? (
          <Button variant="outline-primary" size="sm" href={detailsHref}>
            Review
          </Button>
        ) : (
          <div className="-mr-2 -mt-0.5 flex gap-0.5">
            <IconButton
              icon={<Bars3Icon className="size-4" />}
              label="View request"
              href={detailsHref}
              className="tooltip-left text-muted hover:bg-surface-strong"
            />
            {variant === 'member' && isPending && (
              <>
                <IconButton
                  icon={<PencilSquareIcon className="size-4" />}
                  label="Edit request"
                  href={`/requests/${request.id}/edit`}
                  className="tooltip-left text-muted hover:bg-surface-strong"
                />
                <IconButton
                  icon={<TrashIcon className="size-4" />}
                  label="Delete request"
                  onClick={() => onDelete?.(request)}
                  className="tooltip-left text-red-600 hover:bg-red-50"
                />
              </>
            )}
          </div>
        )}
        <p className="flex items-baseline gap-1 text-xs text-muted">
          Submitted
          <span className="text-body">
            {formatDate({ value: request.created_at, includeTime: true })}
          </span>
        </p>
      </div>
    </article>
  )
}

export default RequestCard
