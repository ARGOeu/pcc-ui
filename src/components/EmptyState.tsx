interface EmptyStateProps {
  message: string
  className?: string
}

const EmptyState = ({ message, className = '' }: EmptyStateProps) => (
  <div
    className={`rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs ${className}`}
  >
    <p className="text-sm italic text-muted">{message}</p>
  </div>
)

export default EmptyState
