import { LockClosedIcon } from '@heroicons/react/16/solid'
import type { HandleAccess } from '@/types/handles'

const textButtonClass =
  'cursor-pointer rounded-xs text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

interface AuthorizedAccountProps {
  access: HandleAccess
  onChangeAccount: () => void
  onForgetToken: () => void
  className?: string
}

const AuthorizedAccount = ({
  access,
  onChangeAccount,
  onForgetToken,
  className,
}: AuthorizedAccountProps) => (
  <div
    className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md border border-line bg-surface-muted py-1.5 pr-3 pl-3 text-sm text-body ${className ?? ''}`}
  >
    <span
      title={`Authorized as ${access.account.username} on ${access.account.endpoint}`}
      className="flex min-w-40 flex-1 items-center gap-2 before:break-all"
    >
      <LockClosedIcon className="size-4 shrink-0 text-muted" />
      <span className="line-clamp-2 min-w-0 text-left wrap-anywhere">
        Authorized as{' '}
        <strong className="font-mono font-medium">
          {access.account.username}
        </strong>{' '}
        on <span className="font-mono">{access.account.endpoint}</span>
      </span>
    </span>
    <span className="flex shrink-0 gap-4">
      <button
        type="button"
        onClick={onChangeAccount}
        className={`${textButtonClass} text-brand hover:text-brand-strong`}
      >
        Change account
      </button>
      <button
        type="button"
        onClick={onForgetToken}
        className={`${textButtonClass} text-red-600 hover:text-red-700`}
      >
        Forget token
      </button>
    </span>
  </div>
)

export default AuthorizedAccount
