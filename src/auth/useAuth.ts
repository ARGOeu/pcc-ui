import { use } from 'react'
import { AuthContext } from './context'

export const useAuth = () => {
  return use(AuthContext)
}
