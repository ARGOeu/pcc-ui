import type { Handle } from '@/types/handles'

export const urlValueType = 'url'

export const isUrlType = (type: string): boolean =>
  type.toLowerCase() === urlValueType

export const getHandleSuffix = (handle: string): string =>
  handle.slice(handle.indexOf('/') + 1)

const findTargetUrlValue = (handle: Handle) =>
  handle.values.find((item) => item.type === urlValueType) ??
  handle.values.find((item) => isUrlType(item.type))

export const getTargetUrl = (handle: Handle): string | undefined => {
  const value = findTargetUrlValue(handle)?.data.value
  return typeof value === 'string' ? value : undefined
}

export interface CustomField {
  index: number
  key: string
  value: string
}

export const getCustomFields = (
  handle: Handle,
  includeOtherUrls = false,
): CustomField[] => {
  const targetIndex = findTargetUrlValue(handle)?.index

  return handle.values.flatMap((item) =>
    typeof item.data.value === 'string' &&
    (includeOtherUrls ? item.index !== targetIndex : !isUrlType(item.type))
      ? [{ index: item.index, key: item.type, value: item.data.value }]
      : [],
  )
}

export const getLastModified = (handle: Handle): string | undefined =>
  handle.values.reduce<string | undefined>(
    (latest, item) =>
      item.timestamp && (!latest || item.timestamp > latest)
        ? item.timestamp
        : latest,
    undefined,
  )
