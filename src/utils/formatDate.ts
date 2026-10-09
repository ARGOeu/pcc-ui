interface FormatDateParams {
  value: string
  includeTime?: boolean
  utc?: boolean
}

const formatDate = ({
  value,
  includeTime = false,
  utc = true,
}: FormatDateParams): string => {
  const formatted = new Date(value).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
    ...(utc && { timeZone: 'UTC' }),
  })

  return utc ? `${formatted} (UTC)` : formatted
}

export default formatDate
