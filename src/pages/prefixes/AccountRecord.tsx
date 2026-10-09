import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import IconButton from '@/components/IconButton'
import formatDate from '@/utils/formatDate'
import type { Account } from '@/types/accounts'

const fieldLabelClass = 'text-[13px] text-muted'
const monoValueClass = 'font-mono text-sm text-foreground'

interface CopyButtonProps {
  label: string
  value: string
}

const CopyButton = ({ label, value }: CopyButtonProps) => {
  const handleCopy = () => {
    void navigator.clipboard.writeText(value).then(
      () => toast.success(`${label} copied to the clipboard`),
      () => toast.error(`Could not copy the ${label.toLowerCase()}`),
    )
  }

  return (
    <IconButton
      icon={<Copy className="size-4" />}
      label={`Copy ${label.toLowerCase()}`}
      onClick={handleCopy}
      className="tooltip-right shrink-0 text-subtle hover:bg-surface-strong"
    />
  )
}

interface AccountRecordProps {
  account: Account
  prefixName?: string
  editHref: string
  onDelete: (account: Account) => void
}

const AccountRecord = ({
  account,
  prefixName,
  editHref,
  onDelete,
}: AccountRecordProps) => {
  const title = account.username
    ? prefixName
      ? `${prefixName}/${account.username}`
      : account.username
    : account.email

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-line bg-white px-5 pt-4 pb-3 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1 max-h-5">
            <h2
              title={account.username ? 'Handle service username' : undefined}
              className="min-w-0 break-all font-mono text-base font-medium text-foreground"
            >
              {title}
            </h2>
            {account.username && (
              <CopyButton label="Username" value={account.username} />
            )}
          </div>
          {account.username && (
            <p className="break-all text-sm text-muted">{account.email}</p>
          )}
        </div>
        <div className="-mr-2 -mt-0.5 flex shrink-0 gap-0.5">
          <IconButton
            icon={<PencilSquareIcon className="size-4" />}
            label="Edit account"
            href={editHref}
            className="tooltip-left text-muted hover:bg-surface-strong"
          />
          <IconButton
            icon={<TrashIcon className="size-4" />}
            label="Delete account"
            onClick={() => onDelete(account)}
            className="tooltip-left text-red-600 hover:bg-red-50"
          />
        </div>
      </div>

      <div className="min-w-0">
        <p className={fieldLabelClass}>Endpoint</p>
        <div className="inline-flex max-w-full items-center gap-1 max-h-0.5">
          <code className={`${monoValueClass} min-w-0 break-all`}>
            {account.endpoint}
          </code>
          <CopyButton label="Endpoint" value={account.endpoint} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-2">
        <div className="min-w-0">
          <p className={`${fieldLabelClass} mb-0.5`}>Admin index</p>
          <p className={monoValueClass}>{account.admin_index}</p>
        </div>
        <div className="min-w-0">
          <p className={`${fieldLabelClass} mb-0.5`}>Permissions</p>
          <p className={monoValueClass}>{account.permissions}</p>
        </div>
      </div>

      <p className="flex items-baseline justify-end gap-1 text-xs text-muted">
        Created
        <span className="text-body">
          {formatDate({ value: account.created_at, includeTime: true })}
        </span>
      </p>
    </div>
  )
}

export default AccountRecord
