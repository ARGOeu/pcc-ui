import { useState } from 'react'
import { useGetRoles } from '@/hooks/useRoles'
import {
  useGetUserInvitations,
  useRespondToInvitationMutation,
} from '@/hooks/useInvitations'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import DataTable, { thBase, tdBase } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import Badge from '@/components/Badge'
import IconButton from '@/components/IconButton'
import capitalizeWord from '@/utils/capitalizeWord'
import formatDate from '@/utils/formatDate'
import getRolePreferredName from '@/utils/getRolePreferredName'
import type {
  Invitation,
  InvitationAction,
  InvitationStatus,
} from '@/types/invitations'

const pageSize = 10

const statusBadgeClass: Record<InvitationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
  REVOKED: 'bg-surface-strong text-muted',
}

const actionText: Record<InvitationAction, { verb: string; past: string }> = {
  ACCEPT: { verb: 'accept', past: 'accepted' },
  REJECT: { verb: 'reject', past: 'rejected' },
}

const MyInvitations = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useGetUserInvitations(
    currentPage,
    pageSize,
  )
  const { data: roles } = useGetRoles()
  const respondMutation = useRespondToInvitationMutation()

  const handleRespond = (invitation: Invitation, action: InvitationAction) => {
    respondMutation.mutate(
      { invitation, action },
      {
        onSuccess: () => {
          toast.success(`Invitation ${actionText[action].past} successfully!`)
        },
        onError: (err) => {
          toast.error(
            `Failed to ${actionText[action].verb} invitation: ${err.message}`,
          )
        },
      },
    )
  }

  const invitations = data?.content ?? []
  const totalPages = data?.total_pages ?? 0
  const totalElements = data?.total_elements ?? 0

  return (
    <div className="page-container">
      <PageHeader
        title="My invitations"
        subtitle="Accept or reject invitations to take a role on a prefix in the catalogue"
        className="mb-4"
      />

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="invitations" />
      ) : (
        <>
          <DataTable
            isEmpty={!invitations.length}
            emptyMessage="You have no invitations"
            emptyColSpan={6}
            tableClassName="min-w-175"
            header={
              <thead className="bg-gray-100">
                <tr>
                  <th className={thBase}>Prefix</th>
                  <th className={thBase}>Email</th>
                  <th className={thBase}>Role</th>
                  <th className={thBase}>Status</th>
                  <th className={thBase}>Created</th>
                  <th className={`${thBase} w-40`}>Actions</th>
                </tr>
              </thead>
            }
          >
            <tbody className="divide-y divide-gray-100">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-surface-muted">
                  <td
                    className={`${tdBase} font-medium text-foreground wrap-break-word`}
                  >
                    {invitation.prefix_name}
                  </td>
                  <td className={`${tdBase} text-muted break-all`}>
                    {invitation.email}
                  </td>
                  <td className={tdBase}>
                    <Badge
                      size="xs"
                      className="bg-brand-muted text-brand-strong"
                    >
                      {getRolePreferredName(roles, invitation.role)}
                    </Badge>
                  </td>
                  <td className={tdBase}>
                    <Badge
                      size="xs"
                      className={statusBadgeClass[invitation.status]}
                    >
                      {capitalizeWord(invitation.status)}
                    </Badge>
                  </td>
                  <td className={`${tdBase} text-muted whitespace-nowrap`}>
                    {formatDate({ value: invitation.created_at, utc: false })}
                  </td>
                  <td className={tdBase}>
                    {invitation.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <IconButton
                          icon={<CheckCircleIcon className="size-6 shrink-0" />}
                          label="Accept invitation"
                          onClick={() => handleRespond(invitation, 'ACCEPT')}
                          disabled={respondMutation.isPending}
                          className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        />
                        <IconButton
                          icon={<XCircleIcon className="size-6 shrink-0" />}
                          label="Reject invitation"
                          onClick={() => handleRespond(invitation, 'REJECT')}
                          disabled={respondMutation.isPending}
                          className="text-red-600 bg-red-50 hover:bg-red-100"
                        />
                      </div>
                    ) : (
                      <span className="text-subtle ms-5">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="invitations"
            onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </>
      )}
    </div>
  )
}

export default MyInvitations
