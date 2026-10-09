import { useEffect, useRef } from 'react'
import { useGetRoles } from '@/hooks/useRoles'
import {
  useGetUserInvitation,
  useRespondToInvitationMutation,
} from '@/hooks/useInvitations'
import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import formatDate from '@/utils/formatDate'
import getRolePreferredName from '@/utils/getRolePreferredName'
import type { Invitation, InvitationAction } from '@/types/invitations'
import type { UserProfile } from '@/types/profile'
import type { ReactNode } from 'react'

const redirectDelay = 2000

const actionText: Record<InvitationAction, { verb: string; past: string }> = {
  ACCEPT: { verb: 'accept', past: 'accepted' },
  REJECT: { verb: 'reject', past: 'rejected' },
}

const redirectAfter: Record<InvitationAction, { path: string; label: string }> =
  {
    ACCEPT: { path: '/my-invitations', label: 'My invitations' },
    REJECT: { path: '/', label: 'the homepage' },
  }

interface ReviewLayoutProps {
  children: ReactNode
}

const InvitationLayout = ({ children }: ReviewLayoutProps) => (
  <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-surface-strong to-line p-4 sm:p-8">
    {children}
  </div>
)

const ReviewCard = ({ children }: ReviewLayoutProps) => (
  <div className="w-full max-w-150 rounded-xl bg-white px-6 py-6 shadow-lg sm:px-10">
    {children}
  </div>
)

interface DetailFieldProps {
  label: string
  children: ReactNode
}

const DetailField = ({ label, children }: DetailFieldProps) => (
  <div className="flex flex-col gap-1">
    <dt className="text-sm font-semibold tracking-wide text-body">{label}</dt>
    <dd className="rounded-md border border-line bg-surface-muted px-3 py-2 text-sm wrap-break-word text-foreground">
      {children}
    </dd>
  </div>
)

interface SignedInAsProps {
  profile?: UserProfile
  onLogout: () => void
}

const SignedInAs = ({ profile, onLogout }: SignedInAsProps) => {
  if (!profile) {
    return null
  }

  const fullName = [profile.name, profile.surname].filter(Boolean).join(' ')
  const who = fullName || (profile.email ?? profile.username)

  return (
    <div className="mt-6 border-t border-line pt-4 text-center text-sm text-muted">
      <p className="wrap-break-word">
        Signed in as <strong className="font-medium text-body">{who}</strong>
        {fullName && profile.email && ` (${profile.email})`}
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-1 cursor-pointer font-medium text-brand hover:text-brand-strong hover:underline"
      >
        Log out
      </button>
    </div>
  )
}

const InvitationReview = () => {
  const { id } = useParams<{ id: string }>()
  const { initialized, authenticated, registered, login, logout } = useAuth()
  const navigate = useNavigate()
  const redirectTimerRef = useRef<number | null>(null)

  const isUserReady = authenticated && registered

  const { data: invitation, isLoading } = useGetUserInvitation(
    id ?? '',
    isUserReady,
  )
  const { data: roles } = useGetRoles(isUserReady)
  const { data: profile } = useGetUserProfile(isUserReady)
  const respondMutation = useRespondToInvitationMutation()

  // The page is opened from an emailed link, so send logged-out users straight
  // to login and bring them back here afterwards.
  useEffect(() => {
    if (initialized && !authenticated) {
      login(window.location.href)
    }
  }, [initialized, authenticated, login])

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current)
      }
    }
  }, [])

  // Logging out returns to this invitation, which sends the user straight to
  // the Keycloak login window and then back here.
  const handleLogout = () => logout(window.location.href)

  const handleRespond = (invitation: Invitation, action: InvitationAction) => {
    respondMutation.mutate(
      { invitation, action },
      {
        onSuccess: () => {
          toast.success(`Invitation ${actionText[action].past} successfully!`)
          redirectTimerRef.current = window.setTimeout(() => {
            void navigate(redirectAfter[action].path)
          }, redirectDelay)
        },
        onError: (err) => {
          toast.error(
            `Failed to ${actionText[action].verb} invitation: ${err.message}`,
          )
        },
      },
    )
  }

  if (!initialized || !isUserReady || isLoading) {
    return (
      <InvitationLayout>
        <div className="flex flex-col items-center gap-4 text-muted">
          <LoadingSpinner />
          <p>Loading invitation...</p>
        </div>
      </InvitationLayout>
    )
  }

  if (!invitation) {
    return (
      <InvitationLayout>
        <ReviewCard>
          <div className="mb-1 flex justify-center">
            <ExclamationCircleIcon className="size-12 text-red-500" />
          </div>
          <h1 className="text-center text-lg font-semibold text-foreground sm:text-xl">
            We could not load this invitation
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            This invitation may have expired, been withdrawn, or been sent to a
            different email address than the one you are signed in with.
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              size="md"
              href="/"
              className="w-full sm:w-auto"
            >
              Go to homepage
            </Button>
          </div>
          <SignedInAs profile={profile} onLogout={handleLogout} />
        </ReviewCard>
      </InvitationLayout>
    )
  }

  const roleName = getRolePreferredName(roles, invitation.role)

  if (invitation.status !== 'PENDING') {
    const isAccepted = invitation.status === 'ACCEPTED'
    const isRevoked = invitation.status === 'REVOKED'

    return (
      <InvitationLayout>
        <ReviewCard>
          <div className="mb-6 flex justify-center">
            {isAccepted ? (
              <CheckCircleIcon className="size-16 text-emerald-500" />
            ) : (
              <XCircleIcon className="size-16 text-amber-500" />
            )}
          </div>
          <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            {isRevoked ? 'Invitation revoked' : 'Invitation processed'}
          </h1>
          <p className="mt-4 text-center text-base leading-relaxed text-muted">
            {isRevoked
              ? 'This invitation for the prefix '
              : `You have ${isAccepted ? 'accepted' : 'rejected'} this invitation for the prefix `}
            <strong className="font-semibold text-foreground">
              {invitation.prefix_name}
            </strong>
            {isRevoked ? ' was revoked and can no longer be accepted.' : '.'}
          </p>
          {respondMutation.isSuccess && (
            <p className="mt-2 text-center text-sm text-muted">
              Taking you to{' '}
              {redirectAfter[respondMutation.variables.action].label}
              ...
            </p>
          )}
          <div
            className={`mt-8 flex flex-col flex-wrap gap-3 sm:flex-row ${isAccepted ? 'sm:justify-between' : 'sm:justify-center'}`}
          >
            {isAccepted && (
              <Button
                variant="primary"
                size="md"
                href="/my-invitations"
                className="w-full sm:w-auto"
              >
                My invitations
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              href="/"
              className="w-full sm:w-auto"
            >
              Go to homepage
            </Button>
          </div>
          <SignedInAs profile={profile} onLogout={handleLogout} />
        </ReviewCard>
      </InvitationLayout>
    )
  }

  const isResponding = respondMutation.isPending || respondMutation.isSuccess
  const respondingAction = respondMutation.isPending
    ? respondMutation.variables.action
    : null
  const roleDescription = roles?.find((role) => role.name === invitation.role)
    ?.attributes?.description?.[0]

  return (
    <InvitationLayout>
      <ReviewCard>
        <div className="mb-4 border-b-2 border-line pb-3 text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Invitation for PID Central Catalogue
          </h1>
          <p className="text-base text-muted">
            Review and respond to this invitation
          </p>
        </div>

        <div className="mb-6">
          <dl className="flex flex-col gap-2">
            <DetailField label="Prefix name">
              {invitation.prefix_name}
            </DetailField>
            <DetailField label="Role">{roleName}</DetailField>
            <DetailField label="Email">{invitation.email}</DetailField>
            <DetailField label="Invited on">
              {formatDate({
                value: invitation.created_at,
                includeTime: true,
                utc: false,
              })}
            </DetailField>
          </dl>

          <div className="mt-4 rounded-lg border border-brand-muted bg-brand-subtle p-4 text-sm leading-relaxed text-brand-strong">
            <p>
              By accepting this invitation, you will get the{' '}
              <strong>{roleName}</strong> role on the{' '}
              <strong>{invitation.prefix_name}</strong> prefix.
            </p>
            {roleDescription && <p className="mt-2">{roleDescription}</p>}
          </div>
        </div>

        <div className="flex flex-col flex-wrap justify-between gap-3 sm:flex-row">
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => handleRespond(invitation, 'REJECT')}
            disabled={isResponding}
          >
            {respondingAction === 'REJECT' ? (
              <>
                <LoadingSpinner size="xs" className="text-white!" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircleIcon className="size-6" />
                Reject invitation
              </>
            )}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => handleRespond(invitation, 'ACCEPT')}
            disabled={isResponding}
          >
            {respondingAction === 'ACCEPT' ? (
              <>
                <LoadingSpinner size="xs" className="text-white!" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircleIcon className="size-6" />
                Accept invitation
              </>
            )}
          </Button>
        </div>
        <SignedInAs profile={profile} onLogout={handleLogout} />
      </ReviewCard>
    </InvitationLayout>
  )
}

export default InvitationReview
