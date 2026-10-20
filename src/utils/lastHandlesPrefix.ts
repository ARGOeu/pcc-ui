const storageKey = 'pcc.handles.lastPrefix'

export interface LastHandlesPrefix {
  providerId: number
  prefixId: number
}

export const getLastHandlesPrefix = (): LastHandlesPrefix | undefined => {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      return undefined
    }
    const parsed = JSON.parse(stored) as Partial<LastHandlesPrefix>
    return Number.isInteger(parsed.providerId) &&
      Number.isInteger(parsed.prefixId)
      ? (parsed as LastHandlesPrefix)
      : undefined
  } catch {
    return undefined
  }
}

export const setLastHandlesPrefix = (value: LastHandlesPrefix): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // Saving is optional, so a storage error is ignored
  }
}

export const clearLastHandlesPrefix = (): void => {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // Clearing is optional, so a storage error is ignored
  }
}
