import { useGetRoles, useRevokeRoleMutation } from '@/hooks/useRoles'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ConfirmDialog'
import formatMembershipResource from '@/utils/formatMembershipResource'
import getMemberUsername from '@/utils/getMemberUsername'
import getRolePreferredName from '@/utils/getRolePreferredName'
import type { Member, MembershipToRevoke } from '@/types/members'
import type { RevokeRoleRequest } from '@/types/roles'

const getMemberName = (member: Member): string =>
  [member.firstName, member.lastName].filter(Boolean).join(' ') ||
  getMemberUsername(member)

const buildRevokeRequest = ({
  member,
  group,
  membership,
}: MembershipToRevoke): RevokeRoleRequest => ({
  api_resource: group,
  resource_id: membership.name,
  role: membership.role,
  member_id: member.id,
})

interface RevokeRoleDialogProps {
  target: MembershipToRevoke | null
  onClose: () => void
  onRevoked: (target: MembershipToRevoke) => void
}

const RevokeRoleDialog = ({
  target,
  onClose,
  onRevoked,
}: RevokeRoleDialogProps) => {
  const { data: roles } = useGetRoles()
  const revokeMutation = useRevokeRoleMutation()

  const handleConfirm = () => {
    if (!target) {
      return
    }
    revokeMutation.mutate(buildRevokeRequest(target), {
      onSuccess: () => {
        toast.success('Role revoked successfully!')
        onRevoked(target)
        onClose()
      },
      onError: (err) => {
        toast.error(`Failed to revoke role: ${err.message}`)
      },
    })
  }

  const resource =
    target && formatMembershipResource(target.group, target.membership)

  return (
    <ConfirmDialog
      isOpen={!!target}
      title="Revoke role"
      message={
        target && (
          <>
            Are you sure you want to revoke the role{' '}
            <strong>
              {getRolePreferredName(roles, target.membership.role)}
            </strong>
            {resource && (
              <>
                {' '}
                on <strong>{resource}</strong>
              </>
            )}{' '}
            from <strong>{getMemberName(target.member)}</strong>?
            <br />
            <span className="text-amber-600 font-medium">
              The user loses the access that this role gives.
            </span>
          </>
        )
      }
      confirmLabel="Revoke"
      cancelLabel="Cancel"
      isPending={revokeMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}

export default RevokeRoleDialog
