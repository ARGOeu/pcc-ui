const squishEmail = (email: string, start = 3, end = 3): string => {
  const atIndex = email.lastIndexOf('@')
  if (atIndex === -1) {
    return email
  }

  const local = email.slice(0, atIndex)
  if (local.length <= start + end) {
    return email
  }

  return `${local.slice(0, start)}...${local.slice(-end)}${email.slice(atIndex)}`
}

export default squishEmail
