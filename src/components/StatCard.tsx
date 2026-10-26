import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  valueClassName?: string
  caption?: string
  to?: string
}

const StatCard = ({
  label,
  value,
  valueClassName,
  caption,
  to,
}: StatCardProps) => {
  const card = (
    <Card
      className={`px-3 py-2 ${to ? 'h-full transition-colors group-hover:border-line-strong group-hover:bg-surface-muted' : ''}`}
    >
      <div className="text-sm text-muted mb-0.5">{label}</div>
      <div
        className={`text-2xl font-semibold ${valueClassName ?? 'text-foreground'}`}
      >
        {value}
      </div>
      {caption && <div className="text-xs text-muted">{caption}</div>}
    </Card>
  )

  if (!to) {
    return card
  }

  return (
    <Link
      to={to}
      className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {card}
    </Link>
  )
}

export default StatCard
