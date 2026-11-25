import Badge from '@/components/Badge'

interface EpicHealthcheckBadgeProps {
  value?: boolean | null
}

const EpicHealthcheckBadge = ({ value }: EpicHealthcheckBadgeProps) => {
  if (value === null || value === undefined) {
    return null
  }

  return (
    <span className="tooltip tooltip-right" data-tip="EPIC healthcheck">
      <Badge
        size="sm"
        className={
          value
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-surface-strong text-muted'
        }
      >
        <span
          className={`mr-1.5 size-1.5 rounded-full ${
            value ? 'bg-emerald-500' : 'border border-gray-400'
          }`}
        />
        {value ? 'Monitored' : 'Not monitored'}
      </Badge>
    </span>
  )
}

export default EpicHealthcheckBadge
