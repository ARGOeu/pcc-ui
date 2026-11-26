import type { Membership } from '@/types/profile'

const formatMembershipResource = (
  group: string,
  { name }: Membership,
): string | undefined => (name === group ? undefined : `${group} ${name}`)

export default formatMembershipResource
