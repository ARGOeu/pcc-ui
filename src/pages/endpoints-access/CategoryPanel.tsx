import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import SecuredEndpointRow from './SecuredEndpointRow'
import type { Scope, SecuredEndpoint } from '@/types/securedEndpoints'

interface CategoryPanelProps {
  label: string
  endpoints: SecuredEndpoint[]
  isCollapsed: boolean
  pendingAssignments: Record<string, Scope>
  disabled: boolean
  onToggleCollapse: () => void
  onToggleEndpoint: (endpointId: string, defaultScope: Scope) => void
  onScopeChange: (endpointId: string, scope: Scope) => void
}

const CategoryPanel = ({
  label,
  endpoints,
  isCollapsed,
  pendingAssignments,
  disabled,
  onToggleCollapse,
  onToggleEndpoint,
  onScopeChange,
}: CategoryPanelProps) => {
  const selectedCount = endpoints.filter(
    (endpoint) => endpoint.secured_endpoint_id in pendingAssignments,
  ).length

  return (
    <div className="border border-line rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        className={`w-full flex items-center justify-between px-4 py-3 bg-surface-strong cursor-pointer select-none ${
          isCollapsed ? '' : 'border-b border-line'
        }`}
        onClick={onToggleCollapse}
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-foreground">{label}</span>
          <span className="text-xs text-muted font-normal">
            ({selectedCount}/{endpoints.length})
          </span>
        </div>
        {isCollapsed ? (
          <ChevronRightIcon className="size-5 shrink-0 text-muted" />
        ) : (
          <ChevronDownIcon className="size-5 shrink-0 text-muted" />
        )}
      </button>

      {!isCollapsed &&
        endpoints.map((endpoint) => (
          <SecuredEndpointRow
            key={endpoint.secured_endpoint_id}
            endpoint={endpoint}
            scope={pendingAssignments[endpoint.secured_endpoint_id]}
            disabled={disabled}
            onToggle={() =>
              onToggleEndpoint(
                endpoint.secured_endpoint_id,
                endpoint.scopes?.[0] ?? 'ALL',
              )
            }
            onScopeChange={(scope) =>
              onScopeChange(endpoint.secured_endpoint_id, scope)
            }
          />
        ))}
    </div>
  )
}

export default CategoryPanel
