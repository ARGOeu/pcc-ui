import { useGetRoles } from '@/hooks/useRoles'
import {
  MEMBERS_GROUP,
  PREFIX_RESOURCE,
  PROVIDER_RESOURCE,
  SUPER_ADMIN_ROLE,
} from '@/auth/roles'
import DataTable, { thBase, tdBase } from '@/components/DataTable'
import formatMembershipResource from '@/utils/formatMembershipResource'
import getMemberUsername from '@/utils/getMemberUsername'
import getRolePreferredName from '@/utils/getRolePreferredName'
import MembershipChip from './MembershipChip'
import type { Member, MembershipToRevoke } from '@/types/members'

const groupOrder = [SUPER_ADMIN_ROLE, PROVIDER_RESOURCE, PREFIX_RESOURCE]

const getGroupRank = (group: string): number => {
  const index = groupOrder.indexOf(group)
  return index === -1 ? groupOrder.length : index
}

const getRoleAssignments = (member: Member): MembershipToRevoke[] =>
  Object.entries(member.memberships)
    .filter(([group]) => group !== MEMBERS_GROUP)
    .sort(([groupA], [groupB]) => getGroupRank(groupA) - getGroupRank(groupB))
    .flatMap(([group, memberships]) =>
      [...memberships]
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        )
        .map((membership) => ({ member, group, membership })),
    )

const columnGap = 'pl-8!'

interface MembersTableProps {
  members: Member[]
  onRevoke: (target: MembershipToRevoke) => void
}

const MembersTable = ({ members, onRevoke }: MembersTableProps) => {
  const { data: roles } = useGetRoles()

  return (
    <DataTable
      isEmpty={!members.length}
      emptyMessage="No users found"
      emptyColSpan={5}
      tableClassName="min-w-225"
      header={
        <thead className="bg-gray-100">
          <tr>
            <th className={`${thBase} w-1/8`}>Username</th>
            <th className={`${thBase} ${columnGap} w-1/8`}>First name</th>
            <th className={`${thBase} ${columnGap} w-1/8`}>Last name</th>
            <th className={`${thBase} ${columnGap} w-1/6`}>Email</th>
            <th className={`${thBase} ${columnGap}`}>Roles</th>
          </tr>
        </thead>
      }
    >
      <tbody className="divide-y divide-gray-100">
        {members.map((member) => {
          const roleAssignments = getRoleAssignments(member)

          return (
            <tr key={member.id} className="hover:bg-surface-muted">
              <td
                className={`${tdBase} font-medium text-foreground`}
                title={member.username}
              >
                {getMemberUsername(member)
                  .split(/(?=@)/)
                  .map((part) => (
                    <span key={part} className="inline-block">
                      {part}
                    </span>
                  ))}
              </td>
              <td className={`${tdBase} ${columnGap} whitespace-nowrap`}>
                {member.firstName}
              </td>
              <td className={`${tdBase} ${columnGap} whitespace-nowrap`}>
                {member.lastName}
              </td>
              <td
                className={`${tdBase} ${columnGap} text-muted whitespace-nowrap`}
              >
                {member.email}
              </td>
              <td className={`${tdBase} ${columnGap}`}>
                {roleAssignments.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {roleAssignments.map((assignment) => {
                      const { group, membership } = assignment
                      const canRevoke = membership.role !== SUPER_ADMIN_ROLE

                      return (
                        <MembershipChip
                          key={`${group}-${membership.name}-${membership.role}`}
                          resource={formatMembershipResource(group, membership)}
                          role={getRolePreferredName(roles, membership.role)}
                          onRevoke={
                            canRevoke ? () => onRevoke(assignment) : undefined
                          }
                        />
                      )
                    })}
                  </div>
                ) : (
                  <span className="text-muted">No roles</span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </DataTable>
  )
}

export default MembersTable
