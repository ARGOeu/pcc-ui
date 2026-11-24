import { useRevokeInvitationMutation } from '@/hooks/useInvitations'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ConfirmDialog'
import formatInvitationResource from '@/utils/formatInvitationResource'
import type { Invitation } from '@/types/invitations'

interface RevokeInvitationDialogProps {
  invitation: Invitation | null
  onClose: () => void
}

const RevokeInvitationDialog = ({
  invitation,
  onClose,
}: RevokeInvitationDialogProps) => {
  const revokeMutation = useRevokeInvitationMutation()

  const handleConfirm = () => {
    if (!invitation) {
      return
    }
    revokeMutation.mutate(
      { invitationId: invitation.id },
      {
        onSuccess: () => {
          toast.success('Invitation revoked successfully!')
          onClose()
        },
        onError: (err) => {
          toast.error(`Failed to revoke invitation: ${err.message}`)
        },
      },
    )
  }

  return (
    <ConfirmDialog
      isOpen={!!invitation}
      title="Revoke invitation"
      message={
        invitation && (
          <>
            Are you sure you want to revoke the invitation of{' '}
            <strong>{invitation.email}</strong> to{' '}
            <strong>{formatInvitationResource(invitation)}</strong>?
            <br />
            <span className="text-amber-600 font-medium">
              The user can no longer accept it.
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

export default RevokeInvitationDialog
