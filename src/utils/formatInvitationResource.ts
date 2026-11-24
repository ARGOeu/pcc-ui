import type { Invitation } from '@/types/invitations'

const formatInvitationResource = ({
  api_resource,
  resource_id,
}: Pick<Invitation, 'api_resource' | 'resource_id'>): string =>
  `${api_resource} ${resource_id}`

export default formatInvitationResource
