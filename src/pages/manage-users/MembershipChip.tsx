import { XMarkIcon } from '@heroicons/react/16/solid'
import Badge from '@/components/Badge'
import IconButton from '@/components/IconButton'

interface MembershipChipProps {
  resource?: string
  role: string
  onRevoke?: () => void
}

const MembershipChip = ({ resource, role, onRevoke }: MembershipChipProps) => {
  const text = resource ? `${resource} · ${role}` : role

  return (
    <Badge
      size="xs"
      className={`max-w-full ${
        resource
          ? 'bg-brand-muted text-brand-strong'
          : 'bg-surface-strong text-body'
      }`}
    >
      <span className="flex min-w-0 items-center gap-1" title={text}>
        {resource && (
          <>
            <span className="max-w-48 truncate">{resource}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span className="max-w-48 truncate">{role}</span>
      </span>
      {onRevoke && (
        <IconButton
          icon={<XMarkIcon className="size-3.5 shrink-0" />}
          label={`Revoke ${text}`}
          onClick={onRevoke}
          className="p-0.5! ml-1 -mr-1 shrink-0 hover:bg-brand/20"
        />
      )}
    </Badge>
  )
}

export default MembershipChip
