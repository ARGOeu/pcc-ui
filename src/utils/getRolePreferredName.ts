import type { Role } from '@/types/roles'

const getRolePreferredName = (
  roles: Role[] | undefined,
  name: string,
): string =>
  roles?.find((role) => role.name === name)?.attributes?.preferred_name?.[0] ??
  name

export default getRolePreferredName
