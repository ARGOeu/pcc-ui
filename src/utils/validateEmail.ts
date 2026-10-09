const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'Email is required'
  }
  return emailPattern.test(trimmed) ? '' : 'Enter a valid email address'
}

export default validateEmail
