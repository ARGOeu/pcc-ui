import {
  Bars3Icon,
  ChartBarIcon,
  LinkIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { UserCog } from 'lucide-react'
import { usePermissions } from '@/auth/usePermissions'
import IconButton from '@/components/IconButton'
import DataTable, { thBase, tdBase } from '@/components/DataTable'
import capitalizeWord from '@/utils/capitalizeWord'
import type { Permission } from '@/auth/permissions'
import type { Prefix } from '@/types/prefixes'
const actionButtonClass = 'text-muted hover:bg-surface-strong p-1!'
const deleteButtonClass = 'text-red-600 hover:bg-red-50 p-1!'

interface PrefixesTableProps {
  prefixes: Prefix[]
  emptyMessage: string
  onDelete: (prefix: Prefix) => void
}

const PrefixesTable = ({
  prefixes,
  emptyMessage,
  onDelete,
}: PrefixesTableProps) => {
  const { isAllowed } = usePermissions()

  const isAllowedOn = (permission: Permission, prefix: Prefix): boolean =>
    isAllowed(permission, {
      providerId: prefix.provider_id,
      prefixId: prefix.id,
    })

  return (
    <DataTable
      isEmpty={!prefixes.length}
      emptyMessage={emptyMessage}
      emptyColSpan={7}
      header={
        <thead className="bg-gray-100">
          <tr>
            <th className={thBase}>Name</th>
            <th className={thBase}>Owner</th>
            <th className={thBase}>Service</th>
            <th className={thBase}>Domain</th>
            <th className={thBase}>Contract type</th>
            <th className={thBase}>Contract end</th>
            <th className={`${thBase} w-56`}>Actions</th>
          </tr>
        </thead>
      }
    >
      <tbody className="divide-y divide-gray-100">
        {prefixes.map((prefix) => (
          <tr key={prefix.id} className="hover:bg-surface-muted">
            <td className={tdBase}>
              <div className="font-medium text-foreground">{prefix.name}</div>
              <div className="text-xs text-muted">
                by {prefix.provider_name}
              </div>
            </td>
            <td className={tdBase}>{prefix.owner}</td>
            <td className={tdBase}>{prefix.service_name}</td>
            <td className={tdBase}>
              {prefix.domain_name && capitalizeWord(prefix.domain_name)}
            </td>
            <td className={tdBase}>
              {prefix.contract_type_name &&
                capitalizeWord(prefix.contract_type_name)}
            </td>
            <td className={tdBase}>{prefix.contract_end?.split('T')[0]}</td>
            <td className={`${tdBase} whitespace-nowrap`}>
              <div className="flex items-center gap-1">
                <IconButton
                  icon={<Bars3Icon className="size-4 md:size-5" />}
                  label="View prefix"
                  href={`/providers/${prefix.provider_id}/prefixes/${prefix.id}/details`}
                  className={actionButtonClass}
                />
                {isAllowedOn('prefix.edit', prefix) && (
                  <IconButton
                    icon={<PencilSquareIcon className="size-4 md:size-5" />}
                    label="Edit prefix"
                    href={`/providers/${prefix.provider_id}/prefixes/${prefix.id}/edit`}
                    className={actionButtonClass}
                  />
                )}
                <IconButton
                  icon={<LinkIcon className="size-4 md:size-5" />}
                  label="Manage handles"
                  href={`/providers/${prefix.provider_id}/prefixes/${prefix.id}/handles`}
                  className={actionButtonClass}
                />
                {isAllowedOn('account.manage', prefix) && (
                  <IconButton
                    icon={<UserCog className="size-4 md:size-5" />}
                    label="Manage accounts"
                    href={`/providers/${prefix.provider_id}/prefixes/${prefix.id}/accounts`}
                    className={`${actionButtonClass} tooltip-end`}
                  />
                )}
                {isAllowedOn('prefix.statistics', prefix) && (
                  <IconButton
                    icon={<ChartBarIcon className="size-4 md:size-5" />}
                    label="Set statistics"
                    href={`/providers/${prefix.provider_id}/prefixes/${prefix.id}/statistics`}
                    className={`${actionButtonClass} tooltip-end`}
                  />
                )}
                {isAllowedOn('prefix.delete', prefix) && (
                  <IconButton
                    icon={<TrashIcon className="size-4 md:size-5" />}
                    label="Delete prefix"
                    onClick={() => onDelete(prefix)}
                    className={`${deleteButtonClass} tooltip-end`}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default PrefixesTable
