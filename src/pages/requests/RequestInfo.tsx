import Card from '@/components/Card'
import capitalizeWord from '@/utils/capitalizeWord'
import formatDate from '@/utils/formatDate'
import isValidUrl from '@/utils/isValidUrl'
import { expectedHandlesLabels } from '@/utils/prefixRequests'
import type { ReactNode } from 'react'
import type { PrefixRequest } from '@/types/prefixRequests'

const labelClass = 'text-[13px] text-muted mb-0.5'

interface InfoFieldProps {
  label: string
  wide?: boolean
  children: ReactNode
}

const InfoField = ({ label, wide, children }: InfoFieldProps) => (
  <div className={`min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
    <p className={labelClass}>{label}</p>
    <div className="text-sm text-foreground wrap-break-word">{children}</div>
  </div>
)

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className="flex flex-col">
    <h2 className="section-title">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
      {children}
    </div>
  </div>
)

interface ReviewSummaryProps {
  request: PrefixRequest
  showReviewResult: boolean
}

const ReviewSummary = ({ request, showReviewResult }: ReviewSummaryProps) => {
  const isPending = request.status === 'PENDING'
  const showProvider = !!request.provider_name || isPending
  const showDate = showReviewResult && !isPending && !!request.updated_at
  const showReason = showReviewResult && !!request.status_reason
  const showWaiting = showReviewResult && isPending

  if (!showProvider && !showDate && !showReason && !showWaiting) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 px-6 py-3 bg-surface-muted border-b border-line rounded-t-lg">
      {(showProvider || showDate) && (
        <div className="flex flex-wrap items-start gap-x-10 gap-y-3">
          {showProvider && (
            <div>
              <p className={labelClass}>Provider</p>
              <p className="text-base font-semibold text-foreground">
                {request.provider_name ?? (
                  <span className="font-normal text-muted">
                    Not assigned yet
                  </span>
                )}
              </p>
            </div>
          )}
          {showDate && request.updated_at && (
            <div className={showProvider ? 'ml-auto text-right' : ''}>
              <p className={labelClass}>{capitalizeWord(request.status)} on</p>
              <p className="text-base text-foreground">
                {formatDate({ value: request.updated_at, includeTime: true })}
              </p>
            </div>
          )}
        </div>
      )}
      {showReason && (
        <div>
          <p className={labelClass}>Reason from the administrator</p>
          <p className="text-sm text-foreground">{request.status_reason}</p>
        </div>
      )}
      {showWaiting && (
        <p className="section-description">
          Waiting for an administrator to review it.
        </p>
      )}
    </div>
  )
}

interface RequestInfoProps {
  request: PrefixRequest
  showReviewResult: boolean
}

const RequestInfo = ({ request, showReviewResult }: RequestInfoProps) => (
  <Card>
    <ReviewSummary request={request} showReviewResult={showReviewResult} />

    <div className="flex flex-col gap-5 px-6 py-2">
      <Section title="Contact person">
        <InfoField label="Name">
          {request.contact_person_name} {request.contact_person_surname}
        </InfoField>
        <InfoField label="Email">
          <span className="break-all">{request.contact_person_email}</span>
        </InfoField>
        <InfoField label="Phone">
          {request.contact_person_phone ?? (
            <span className="text-subtle">-</span>
          )}
        </InfoField>
        <InfoField label="Country">{request.country}</InfoField>
      </Section>

      <Section title="Organisation and project">
        <InfoField label="Organisation">{request.organization_name}</InfoField>
        <InfoField label="Project">{request.project_name}</InfoField>
        <InfoField label="Project URL" wide>
          {isValidUrl(request.project_url) ? (
            <a
              href={request.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline break-all hover:text-brand-strong"
            >
              {request.project_url}
            </a>
          ) : (
            <span className="break-all">{request.project_url}</span>
          )}
        </InfoField>
        {request.project_description && (
          <InfoField label="Project description" wide>
            {request.project_description}
          </InfoField>
        )}
      </Section>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <Section title="Expected size">
          <InfoField label="Expected number of handles">
            {expectedHandlesLabels[request.expected_handles]}
          </InfoField>
        </Section>

        <p className="ml-auto flex items-baseline gap-1 text-xs text-muted">
          Submitted
          <span className="text-body">
            {formatDate({ value: request.created_at, includeTime: true })}
          </span>
        </p>
      </div>
    </div>
  </Card>
)

export default RequestInfo
