import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  inline?: boolean
}

const sizeClasses = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
}

const LoadingSpinner = ({
  size = 'md',
  className = '',
  inline = false,
}: LoadingSpinnerProps) => {
  const sizeClass = sizeClasses[size]
  const inlineClass = inline ? 'inline-block' : ''
  const combinedClassName =
    `animate-spin ${sizeClass} text-brand ${inlineClass} ${className}`.trim()

  return <ArrowPathIcon className={combinedClassName} />
}

export default LoadingSpinner
