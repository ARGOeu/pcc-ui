import { PencilSquareIcon } from '@heroicons/react/16/solid'
import Card from '@/components/Card'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import type { Role } from '@/types/roles'

interface RoleListPanelProps {
  roles: Role[]
  selectedRoleId: string | null
  actionCounts: Record<string, number>
  onSelectRole: (roleId: string) => void
  onAddRole: () => void
  onEditRole: (role: Role) => void
}

const RoleListPanel = ({
  roles,
  selectedRoleId,
  actionCounts,
  onSelectRole,
  onAddRole,
  onEditRole,
}: RoleListPanelProps) => (
  <Card className="xl:sticky xl:top-4">
    <div className="flex items-center justify-between px-4 py-3 border-b border-line">
      <p className="section-title mb-0">Roles</p>
      <Button variant="outline-primary" size="xs" onClick={onAddRole}>
        Add role
      </Button>
    </div>
    {roles.length === 0 ? (
      <p className="text-sm text-subtle italic text-center py-6 px-4">
        No roles found
      </p>
    ) : (
      <ul>
        {roles.map((role) => (
          <li
            key={role.id}
            className={`flex items-center gap-2 px-3 py-2.5 border-b border-line last:border-b-0 last:rounded-b-lg cursor-pointer transition-colors ${
              role.id === selectedRoleId
                ? 'bg-brand-subtle'
                : 'hover:bg-surface-muted'
            }`}
            onClick={() => onSelectRole(role.id)}
          >
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm truncate ${role.id === selectedRoleId ? 'text-brand font-medium' : 'text-foreground'}`}
              >
                {role.attributes?.preferred_name?.[0] ?? role.name}
              </p>
              {role.attributes?.description?.[0] && (
                <p
                  className="text-xs text-subtle line-clamp-2"
                  title={role.attributes.description[0]}
                >
                  {role.attributes.description[0]}
                </p>
              )}
            </div>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-surface-strong text-muted border border-line shrink-0">
              {actionCounts[role.id] ?? 0}
            </span>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <IconButton
                icon={<PencilSquareIcon className="size-4" />}
                label=""
                onClick={() => onEditRole(role)}
                className="text-muted hover:bg-surface-strong"
              />
            </div>
          </li>
        ))}
      </ul>
    )}
  </Card>
)

export default RoleListPanel
