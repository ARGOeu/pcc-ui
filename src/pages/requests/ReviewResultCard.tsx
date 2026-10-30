import Card from '@/components/Card'
import capitalizeWord from '@/utils/capitalizeWord'
import formatDate from '@/utils/formatDate'
import type { PrefixRequest } from '@/types/prefixRequests'

const labelClass = 'text-[13px] text-muted mb-0.5'
const valueClass = 'text-sm text-foreground wrap-break-word'

interface ReviewResultCardProps {
  request: PrefixRequest
}

const ReviewResultCard = ({ request }: ReviewResultCardProps) => {
  return (
    <Card className="lg:sticky lg:top-4">
      <div className="flex flex-col gap-1 px-5 py-4">
        <h2 className="section-title">Review result</h2>
        <div className="flex flex-col gap-2">
          {request.updated_at && (
            <div>
              <p className={labelClass}>{capitalizeWord(request.status)} on</p>
              <p className={valueClass}>
                {formatDate({ value: request.updated_at, includeTime: true })}
              </p>
            </div>
          )}
          <div>
            <p className={labelClass}>Provider</p>
            <p className={valueClass}>
              {request.provider_name ?? (
                <span className="text-muted">Not assigned</span>
              )}
            </p>
          </div>
          {request.status_reason && (
            <div>
              <p className={labelClass}>Reason</p>
              <p className={valueClass}>{request.status_reason}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ReviewResultCard
