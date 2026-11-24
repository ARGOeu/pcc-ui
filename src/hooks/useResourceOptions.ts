import { useEffect, useState } from 'react'
import { useGetAllPrefixes } from '@/hooks/useAdmin'
import { useGetProviderPrefixes } from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { PREFIX_RESOURCE, PROVIDER_RESOURCE } from '@/auth/roles'
import type { SelectOption } from '@/components/SelectDropdown'
import type { Prefix } from '@/types/prefixes'

const pageSize = 20

const getPrefixLabel = (prefix: Prefix): string =>
  prefix.provider_name
    ? `${prefix.name} · ${prefix.provider_name}`
    : prefix.name

export interface ResourceOptions {
  options: SelectOption[]
  isLoading: boolean
  error: Error | null
  footer?: string
  onSearchChange?: (query: string) => void
  onScrollEnd: () => void
}

export const useResourceOptions = (
  apiResource: string,
  providerId?: number,
  enabled = true,
): ResourceOptions => {
  const isProvider = apiResource === PROVIDER_RESOURCE
  const isPrefix = apiResource === PREFIX_RESOURCE
  const scope = `${apiResource}-${providerId ?? ''}`

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchScope, setSearchScope] = useState(scope)

  if (scope !== searchScope) {
    setSearchScope(scope)
    setSearchInput('')
    setSearchQuery('')
  }

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const providers = useGetProviders(enabled && isProvider)
  const allPrefixes = useGetAllPrefixes(
    pageSize,
    searchQuery || undefined,
    undefined,
    enabled && isPrefix && !providerId,
  )
  const providerPrefixes = useGetProviderPrefixes(
    providerId ?? 0,
    pageSize,
    searchQuery || undefined,
    undefined,
    enabled && isPrefix && !!providerId,
  )
  const prefixes = providerId ? providerPrefixes : allPrefixes

  const handleScrollEnd = () => {
    if (prefixes.hasNextPage && !prefixes.isFetchingNextPage) {
      void prefixes.fetchNextPage()
    }
  }

  if (isProvider) {
    return {
      options: (providers.data ?? []).map((provider) => ({
        value: String(provider.id),
        label: provider.name,
      })),
      isLoading: providers.isLoading,
      error: providers.error,
      onScrollEnd: handleScrollEnd,
    }
  }

  const listedPrefixes = prefixes.data?.pages.flatMap((page) => page.content)
  const totalPrefixes = prefixes.data?.pages.at(-1)?.total_elements ?? 0
  const listedCount = listedPrefixes?.length ?? 0
  const getFooter = (): string | undefined => {
    if (!isPrefix) {
      return undefined
    }
    if (prefixes.isLoading) {
      return 'Loading prefixes...'
    }
    if (prefixes.isFetchingNextPage) {
      return 'Loading more prefixes...'
    }
    return totalPrefixes > listedCount
      ? `Showing ${listedCount} of ${totalPrefixes} prefixes`
      : undefined
  }

  return {
    options: (listedPrefixes ?? []).map((prefix) => ({
      value: String(prefix.id),
      label: getPrefixLabel(prefix),
    })),
    isLoading: prefixes.isLoading,
    error: isPrefix ? prefixes.error : null,
    footer: getFooter(),
    onSearchChange: isPrefix ? setSearchInput : undefined,
    onScrollEnd: handleScrollEnd,
  }
}
