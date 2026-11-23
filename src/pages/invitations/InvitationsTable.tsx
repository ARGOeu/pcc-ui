import { useGetRoles } from '@/hooks/useRoles'
import { NoSymbolIcon } from '@heroicons/react/16/solid'
import DataTable, {
  SortableColumnHeader,
  thBase,
  tdBase,
} from '@/components/DataTable'
import Badge from '@/components/Badge'
import IconButton from '@/components/IconButton'
import capitalizeWord from '@/utils/capitalizeWord'
import formatDate from '@/utils/formatDate'
import formatInvitationResource from '@/utils/formatInvitationResource'
import getRolePreferredName from '@/utils/getRolePreferredName'
import type {
  Invitation,
  InvitationSort,
  InvitationSortField,
  InvitationStatus,
} from '@/types/invitations'

const statusBadgeClass: Record<InvitationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
  REVOKED: 'bg-surface-strong text-muted',
}

interface SortableHeaderCellProps {
  field: InvitationSortField
  label: string
  sort: InvitationSort
  onSortClick: (field: InvitationSortField) => void
}

const SortableHeaderCell = ({
  field,
  label,
  sort,
  onSortClick,
}: SortableHeaderCellProps) => (
  <th className={thBase}>
    <SortableColumnHeader
      isActive={sort.field === field}
      isAscending={sort.order === 'ASC'}
      onClick={() => onSortClick(field)}
    >
      {label}
    </SortableColumnHeader>
  </th>
)

interface InvitationsTableProps {
  invitations: Invitation[]
  sort: InvitationSort
  onSortClick: (field: InvitationSortField) => void
  onRevoke: (invitation: Invitation) => void
}

const InvitationsTable = ({
  invitations,
  sort,
  onSortClick,
  onRevoke,
}: InvitationsTableProps) => {
  const { data: roles } = useGetRoles()

  return (
    <DataTable
      isEmpty={!invitations.length}
      emptyMessage="No invitations found"
      emptyColSpan={6}
      tableClassName="min-w-175"
      header={
        <thead className="bg-gray-100">
          <tr>
            <th className={thBase}>Resource</th>
            <SortableHeaderCell
              field="email"
              label="Email"
              sort={sort}
              onSortClick={onSortClick}
            />
            <th className={thBase}>Role</th>
            <SortableHeaderCell
              field="status"
              label="Status"
              sort={sort}
              onSortClick={onSortClick}
            />
            <SortableHeaderCell
              field="createdAt"
              label="Created"
              sort={sort}
              onSortClick={onSortClick}
            />
            <th className={`${thBase} w-28`}>Actions</th>
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
              {formatInvitationResource(invitation)}
            </td>
            <td className={`${tdBase} text-muted break-all`}>
              {invitation.email}
            </td>
            <td className={tdBase}>
              <Badge size="xs" className="bg-brand-muted text-brand-strong">
                {getRolePreferredName(roles, invitation.role)}
              </Badge>
            </td>
            <td className={tdBase}>
              <Badge size="xs" className={statusBadgeClass[invitation.status]}>
                {capitalizeWord(invitation.status)}
              </Badge>
            </td>
            <td className={`${tdBase} text-muted whitespace-nowrap`}>
              {formatDate({ value: invitation.created_at, utc: false })}
            </td>
            <td className={tdBase}>
              {invitation.status === 'PENDING' ? (
                <IconButton
                  icon={<NoSymbolIcon className="size-5 shrink-0" />}
                  label="Revoke invitation"
                  onClick={() => onRevoke(invitation)}
                  className="text-red-600 hover:bg-red-50"
                />
              ) : (
                <span className="text-subtle ms-2">-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default InvitationsTable
