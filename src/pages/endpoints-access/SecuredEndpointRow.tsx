import { CheckIcon } from '@heroicons/react/16/solid'
import Badge from '@/components/Badge'
import type { Scope, SecuredEndpoint } from '@/types/securedEndpoints'

interface SecuredEndpointRowProps {
  endpoint: SecuredEndpoint
  scope: Scope | undefined
  disabled: boolean
  onToggle: () => void
  onScopeChange: (scope: Scope) => void
}

const actionClassMap: Record<string, string> = {
  GET: 'bg-brand-muted text-brand',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-amber-100 text-amber-700',
  PATCH: 'bg-teal-100 text-teal-700',
  DELETE: 'bg-red-100 text-red-700',
}

const scopeLabels: Record<Scope, string> = {
  ALL: 'All',
  MINE: 'Own only',
}

const SecuredEndpointRow = ({
  endpoint,
  scope,
  disabled,
  onToggle,
  onScopeChange,
}: SecuredEndpointRowProps) => {
  const isAssigned = scope !== undefined
  const availableScopes: Scope[] = endpoint.scopes?.length
    ? endpoint.scopes
    : ['ALL']
  const hasMultipleScopes = availableScopes.length > 1

  return (
    <div
      className={`border-b border-line last:border-b-0 transition-colors ${
        isAssigned ? 'bg-brand-subtle' : 'hover:bg-surface-muted'
      }`}
    >
      <label className="flex items-start gap-3 px-4 py-2.5 cursor-pointer">
        <div
          className={`relative size-4 shrink-0 rounded border flex items-center justify-center transition-colors mt-0.5 ${
            isAssigned ? 'bg-brand border-brand' : 'border-line-strong bg-white'
          }`}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={isAssigned}
            disabled={disabled}
            onChange={onToggle}
          />
          {isAssigned && <CheckIcon className="size-3 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              size="sm"
              className={
                actionClassMap[endpoint.action] ?? 'bg-gray-100 text-gray-700'
              }
            >
              {endpoint.action}
            </Badge>
            <span className="text-sm font-medium text-foreground break-all">
              {endpoint.path}
            </span>
          </div>
          {endpoint.description && (
            <p className="text-xs text-muted mt-0.5">{endpoint.description}</p>
          )}
        </div>
      </label>

      {hasMultipleScopes && (
        <div
          className={`flex items-center gap-4 pl-11 pr-4 pb-2.5 ${
            isAssigned ? '' : 'pointer-events-none opacity-40'
          }`}
        >
          <span className="text-xs font-medium text-muted shrink-0">
            Scope:
          </span>
          {availableScopes.map((option) => (
            <label
              key={option}
              className={`inline-flex items-center gap-1.5 ${isAssigned ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <input
                type="radio"
                name={`scope-${endpoint.secured_endpoint_id}`}
                value={option}
                checked={scope === option}
                disabled={disabled}
                onChange={() => onScopeChange(option)}
                className="accent-brand"
              />
              <span className="text-xs select-none text-body">
                {scopeLabels[option]}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default SecuredEndpointRow
