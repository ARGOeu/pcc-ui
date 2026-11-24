import { useState } from 'react'
import { useGetProviders } from '@/hooks/useProviders'
import { useResourceOptions } from '@/hooks/useResourceOptions'
import { useAuth } from '@/auth/useAuth'
import { usePermissions } from '@/auth/usePermissions'
import { PREFIX_RESOURCE, PROVIDER_RESOURCE } from '@/auth/roles'
import type { ResourceOptions } from '@/hooks/useResourceOptions'
import type { Provider } from '@/types/providers'

interface Selection {
  type: string
  id: string
  label: string
  providerChoice: string
}

const emptySelection: Selection = {
  type: '',
  id: '',
  label: '',
  providerChoice: '',
}

export interface InvitationResource {
  canLoad: boolean
  isSuperAdmin: boolean
  providers: Provider[]
  isLoadingProviders: boolean
  providersError: Error | null
  resources: ResourceOptions
  type: string
  id: string
  label?: string
  isPrefix: boolean
  providerId?: number
  needsResource: boolean
  inviteHref?: string
  onTypeChange: (value: string) => void
  onProviderChange: (value: string) => void
  onResourceChange: (value: string) => void
}

export const useInvitationResource = (
  onSelectionChange: () => void,
): InvitationResource => {
  const { rolesReady, isSuperAdmin, isProviderAdmin } = useAuth()
  const { isAllowed } = usePermissions()
  const [selection, setSelection] = useState(emptySelection)

  const canLoad = rolesReady && (isSuperAdmin || isProviderAdmin)
  const providers = useGetProviders(canLoad && !isSuperAdmin)

  // A provider admin starts with the first provider
  const defaultProvider = isSuperAdmin ? undefined : providers.data?.[0]

  const type = selection.type || (isSuperAdmin ? '' : PROVIDER_RESOURCE)
  const isPrefix = type === PREFIX_RESOURCE
  const usesDefaultProvider =
    !isSuperAdmin && type === PROVIDER_RESOURCE && !selection.id
  const id = usesDefaultProvider
    ? String(defaultProvider?.id ?? '')
    : selection.id
  const label = usesDefaultProvider
    ? defaultProvider?.name
    : selection.label || undefined
  const providerId =
    !isSuperAdmin && isPrefix
      ? Number(selection.providerChoice) || defaultProvider?.id
      : undefined

  const resources = useResourceOptions(
    type,
    providerId,
    canLoad && (isSuperAdmin || !isPrefix || !!providerId),
  )

  const select = (changes: Partial<Selection>) => {
    setSelection((prev) => ({ ...prev, ...changes }))
    onSelectionChange()
  }

  const getInviteHref = (): string | undefined => {
    if (isSuperAdmin) {
      return '/invite-user'
    }
    if (!id) {
      return undefined
    }

    if (!isPrefix) {
      return isAllowed('provider.invite', { providerId: Number(id) })
        ? `/providers/${id}/invite`
        : undefined
    }
    return providerId &&
      isAllowed('prefix.invite', { providerId, prefixId: Number(id) })
      ? `/providers/${providerId}/prefixes/${id}/invite`
      : undefined
  }

  return {
    canLoad,
    isSuperAdmin,
    providers: providers.data ?? [],
    isLoadingProviders: providers.isLoading,
    providersError: providers.error,
    resources,
    type,
    id,
    label,
    isPrefix,
    providerId,
    needsResource: !isSuperAdmin && !id,
    inviteHref: getInviteHref(),
    onTypeChange: (value) => select({ type: value, id: '', label: '' }),
    onProviderChange: (value) =>
      select({ providerChoice: value, id: '', label: '' }),
    onResourceChange: (value) =>
      select({
        id: value,
        label:
          resources.options.find((option) => option.value === value)?.label ??
          '',
      }),
  }
}
