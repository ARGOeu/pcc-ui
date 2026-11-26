import type { Membership } from '@/types/profile'

export interface Member {
  id: string
  username: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  memberships: Record<string, Membership[]>
}

export interface MembersResponse {
  content: Member[]
  size_of_page: number
  number_of_page: number
  total_elements: number
  total_pages: number
}

export interface MembershipToRevoke {
  member: Member
  group: string
  membership: Membership
}
