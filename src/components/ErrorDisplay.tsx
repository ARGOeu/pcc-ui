import { ExclamationCircleIcon } from '@heroicons/react/16/solid'

interface ErrorDisplayProps {
  error: Error | { message: string } | string
  context?: string
}

const MAX_MESSAGE_LENGTH = 300

const ErrorDisplay = ({ error, context = 'data' }: ErrorDisplayProps) => {
  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'An error occurred'

  const title = `Error Loading ${context.charAt(0).toUpperCase() + context.slice(1)}`
  const isTruncated = errorMessage.length > MAX_MESSAGE_LENGTH
  const displayMessage = isTruncated
    ? `${errorMessage.substring(0, MAX_MESSAGE_LENGTH)}...`
    : errorMessage

  return (
    <div className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-red-50 rounded-lg my-1 text-center">
      <ExclamationCircleIcon className="size-6 text-red-700" />
      <h2 className="text-base font-semibold text-red-800">{title}</h2>
      <p
        className="text-sm text-red-800 max-w-150 overflow-hidden text-ellipsis"
        title={isTruncated ? errorMessage : undefined}
      >
        {displayMessage}
      </p>
    </div>
  )
}

export default ErrorDisplay
