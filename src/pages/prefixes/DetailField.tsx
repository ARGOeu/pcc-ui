import type { ReactNode } from 'react'

interface DetailFieldProps {
  label: string
  value?: ReactNode
}

const DetailField = ({ label, value }: DetailFieldProps) => (
  <div className="flex justify-between gap-4 py-2 border-b border-line last:border-b-0">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-sm text-foreground font-medium text-right">
      {value ?? '—'}
    </span>
  </div>
)

export default DetailField
