import capitalizeWord from '@/utils/capitalizeWord'
import getRolePreferredName from '@/utils/getRolePreferredName'
import type { Role } from '@/types/roles'

// The preferred name of the role
const getRoleLabel = (roles: Role[] | undefined, role: string): string => {
  const preferredName = getRolePreferredName(roles, role)
  return preferredName === role
    ? capitalizeWord(role.replace(/_/g, ' '))
    : preferredName
}

export default getRoleLabel
