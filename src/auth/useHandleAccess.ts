import { use } from 'react'
import { HandleAccessContext } from './handleAccessContext'
import type { HandleAccess } from '@/types/handles'

export const useHandleAccess = (prefixId: number) => {
  const { accessByPrefix, setAccess, clearAccess } = use(HandleAccessContext)
  const access: HandleAccess | undefined = accessByPrefix[prefixId]

  return {
    access,
    setAccess: (newAccess: HandleAccess) => setAccess(prefixId, newAccess),
    clearAccess: () => clearAccess(prefixId),
  }
}
