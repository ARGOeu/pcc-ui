import isValidUrl from '@/utils/isValidUrl'
import { isUrlType } from '@/utils/handleValues'

const allowedSuffixCharacter = /[A-Za-z0-9._~-]/

const toVisibleCharacter = (character: string): string =>
  /\s/.test(character) ? 'space' : character

export const validateSuffix = (value: string): string => {
  if (!value) {
    return 'Suffix is required'
  }
  const notAllowed = Array.from(
    new Set(
      Array.from(value)
        .filter((character) => !allowedSuffixCharacter.test(character))
        .map(toVisibleCharacter),
    ),
  )
  if (notAllowed.length === 0) {
    return ''
  }
  return `${notAllowed.length === 1 ? 'This character is' : 'These characters are'} not allowed: ${notAllowed.join(', ')}`
}

export const validateUrl = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'Target URL is required'
  }
  return isValidUrl(trimmed)
    ? ''
    : 'Enter a valid address starting with http:// or https://'
}

export const validateFieldKey = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'Enter a key'
  }
  if (isUrlType(trimmed)) {
    return 'URL is used by the Target URL field above'
  }
  return ''
}

export const validateFieldValue = (value: string): string =>
  value.trim() ? '' : 'Enter a value'
