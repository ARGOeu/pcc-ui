import { createContext } from 'react'
import type { HandleAccess } from '@/types/handles'

export interface HandleAccessContextType {
  accessByPrefix: Record<number, HandleAccess>
  setAccess: (prefixId: number, access: HandleAccess) => void
  clearAccess: (prefixId: number) => void
}

export const HandleAccessContext = createContext<HandleAccessContextType>({
  accessByPrefix: {},
  setAccess: () => {
    console.warn(
      'HandleAccessContext: setAccess() called outside of HandleAccessProvider',
    )
  },
  clearAccess: () => {
    console.warn(
      'HandleAccessContext: clearAccess() called outside of HandleAccessProvider',
    )
  },
})
