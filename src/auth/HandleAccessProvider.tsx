import { useState } from 'react'
import { HandleAccessContext } from './handleAccessContext'
import type { ReactNode } from 'react'
import type { HandleAccess } from '@/types/handles'

interface HandleAccessProviderProps {
  children: ReactNode
}

// Keeps the Handle service tokens in memory, one entry per prefix
export const HandleAccessProvider = ({
  children,
}: HandleAccessProviderProps) => {
  const [accessByPrefix, setAccessByPrefix] = useState<
    Record<number, HandleAccess>
  >({})

  const setAccess = (prefixId: number, access: HandleAccess) => {
    setAccessByPrefix((prev) => ({ ...prev, [prefixId]: access }))
  }

  const clearAccess = (prefixId: number) => {
    setAccessByPrefix((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => Number(key) !== prefixId),
      ),
    )
  }

  return (
    <HandleAccessContext value={{ accessByPrefix, setAccess, clearAccess }}>
      {children}
    </HandleAccessContext>
  )
}
