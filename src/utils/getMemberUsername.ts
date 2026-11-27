import squishEmail from '@/utils/squishEmail'
import type { Member } from '@/types/members'

const getMemberUsername = ({
  uid,
  username,
}: Pick<Member, 'uid' | 'username'>): string => {
  const trimmedUid = uid?.trim()
  if (trimmedUid) {
    return trimmedUid
  }
  return squishEmail(username, 8, 8)
}

export default getMemberUsername
