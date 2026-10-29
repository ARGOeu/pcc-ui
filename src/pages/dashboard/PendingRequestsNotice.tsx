import { Link } from 'react-router-dom'
import { ClockIcon } from '@heroicons/react/24/outline'

interface PendingRequestsNoticeProps {
  count: number
}

const PendingRequestsNotice = ({ count }: PendingRequestsNoticeProps) => (
  <div
    role="status"
    className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line bg-surface-muted px-5 py-2 text-body"
  >
    <ClockIcon className="size-5 shrink-0 text-amber-700" aria-hidden="true" />
    <p className="min-w-0 flex-1 text-sm">
      <strong className="font-semibold text-foreground">
        {count === 1 ? '1 pending request' : `${count} pending requests`}
      </strong>{' '}
      {count === 1 ? 'is' : 'are'} waiting for review
    </p>
    <Link
      to="/requests?status=pending"
      className="ml-auto text-sm font-medium text-brand underline hover:text-brand-strong"
    >
      {count === 1 ? 'Review pending request' : 'Review pending requests'}
    </Link>
  </div>
)

export default PendingRequestsNotice
