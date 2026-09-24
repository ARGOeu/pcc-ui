import { useNavigate } from 'react-router-dom'
import { Bars3Icon, PencilSquareIcon } from '@heroicons/react/16/solid'
import IconButton from '@/components/IconButton'
import DataTable, { thBase, tdBase } from '@/components/DataTable'
import type { Prefix } from '@/types/prefixes'

interface PrefixesTableProps {
  prefixes: Prefix[]
  emptyMessage: string
}

const PrefixesTable = ({ prefixes, emptyMessage }: PrefixesTableProps) => {
  const navigate = useNavigate()

  return (
    <DataTable
      isEmpty={!prefixes.length}
      emptyMessage={emptyMessage}
      emptyColSpan={7}
    >
      <thead className="bg-gray-100">
        <tr>
          <th className={thBase}>Name</th>
          <th className={thBase}>Owner</th>
          <th className={thBase}>Service</th>
          <th className={thBase}>Domain</th>
          <th className={thBase}>Contract type</th>
          <th className={thBase}>Contract end</th>
          <th className={`${thBase} w-40`}>Actions</th>
        </tr>
      </thead>
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
            <td className={tdBase}>{prefix.domain_name}</td>
            <td className={tdBase}>{prefix.contract_type_name}</td>
            <td className={tdBase}>{prefix.contract_end?.split('T')[0]}</td>
            <td className={`${tdBase} whitespace-nowrap`}>
              <div className="flex items-center gap-2">
                <IconButton
                  icon={<Bars3Icon className="size-4 md:size-5" />}
                  label="View prefix"
                  onClick={() =>
                    void navigate(`/prefixes/${prefix.id}/details`)
                  }
                  className="text-muted hover:bg-surface-strong p-1!"
                />
                <IconButton
                  icon={<PencilSquareIcon className="size-4 md:size-5" />}
                  label="Edit prefix"
                  onClick={() => void navigate(`/prefixes/${prefix.id}/edit`)}
                  className="text-muted hover:bg-surface-strong p-1!"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default PrefixesTable
