import { useCallback, useEffect, useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import SelectDropdown from '@/components/SelectDropdown'
import CategoryPanel from './CategoryPanel'
import RoleForm from './RoleForm'
import { CATEGORY_ORDER, getEndpointCategory } from './endpointCategories'
import type { Role } from '@/types/roles'
import type { Scope, SecuredEndpoint } from '@/types/securedEndpoints'

interface RoleDetailsPanelProps {
  mode: 'assign' | 'create' | 'edit'
  role: Role | null
  securedEndpoints: SecuredEndpoint[]
  pendingAssignments: Record<string, Scope>
  originalAssignments: Record<string, Scope>
  isDirty: boolean
  onToggleEndpoint: (endpointId: string, defaultScope: Scope) => void
  onScopeChange: (endpointId: string, scope: Scope) => void
  onSaveAssignments: () => void
  isSavingAssignments: boolean
  onFormDone: () => void
  onCancelForm: () => void
}

const RoleDetailsPanel = ({
  mode,
  role,
  securedEndpoints,
  pendingAssignments,
  originalAssignments,
  isDirty,
  onToggleEndpoint,
  onScopeChange,
  onSaveAssignments,
  isSavingAssignments,
  onFormDone,
  onCancelForm,
}: RoleDetailsPanelProps) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(),
  )
  const [isStuck, setIsStuck] = useState(false)
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null)
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinel(node)
  }, [])

  useEffect(() => {
    if (!sentinel) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinel])

  if (mode === 'create' || mode === 'edit') {
    return (
      <Card>
        <RoleForm
          key={mode === 'edit' ? role?.id : 'create'}
          role={mode === 'edit' ? role : null}
          onDone={onFormDone}
          onCancel={onCancelForm}
        />
      </Card>
    )
  }

  if (!role) {
    return (
      <Card>
        <p className="text-sm text-subtle italic text-center py-12 px-4">
          Select a role to manage its endpoint access
        </p>
      </Card>
    )
  }

  const query = search.toLowerCase()
  const filteredEndpoints = query
    ? securedEndpoints.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(query) ||
          (endpoint.description ?? '').toLowerCase().includes(query) ||
          endpoint.action.toLowerCase().includes(query),
      )
    : securedEndpoints

  const presentCategories = new Set(
    securedEndpoints.map((endpoint) => getEndpointCategory(endpoint.path)),
  )
  const availableCategories = CATEGORY_ORDER.filter((label) =>
    presentCategories.has(label),
  )
  const categoryOptions = [
    { value: 'all', label: 'All categories' },
    ...availableCategories.map((label) => ({ value: label, label })),
  ]
  const groups = availableCategories
    .filter((label) => selectedCategory === 'all' || label === selectedCategory)
    .map((label) => ({
      label,
      endpoints: filteredEndpoints.filter(
        (endpoint) => getEndpointCategory(endpoint.path) === label,
      ),
    }))
    .filter((group) => group.endpoints.length > 0)

  const groupLabels = groups.map((group) => group.label)
  const areAllCollapsed =
    groupLabels.length > 0 &&
    groupLabels.every((label) => collapsedGroups.has(label))

  const handleToggleGroup = (label: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const handleToggleAllGroups = () => {
    setCollapsedGroups(areAllCollapsed ? new Set() : new Set(groupLabels))
  }

  const addedCount = Object.keys(pendingAssignments).filter(
    (id) => !(id in originalAssignments),
  ).length
  const removedCount = Object.keys(originalAssignments).filter(
    (id) => !(id in pendingAssignments),
  ).length

  return (
    <Card>
      <div ref={sentinelRef} className="h-px" />
      <div
        className={`lg:sticky lg:top-0 z-10 bg-white rounded-t-lg transition-all px-4 ${
          isStuck ? 'py-3 border-b border-line' : 'pt-3 pb-2'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="section-title mb-0.5">
              {role.attributes?.preferred_name?.[0] ?? role.name}
            </p>
            <p className="section-description">
              Choose which endpoints this role can access
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isDirty && (addedCount > 0 || removedCount > 0) && (
              <div className="flex flex-col items-end gap-0.5 text-xs">
                {addedCount > 0 && (
                  <span className="text-emerald-600">+{addedCount} added</span>
                )}
                {removedCount > 0 && (
                  <span className="text-red-500">-{removedCount} removed</span>
                )}
              </div>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={onSaveAssignments}
              disabled={!isDirty || isSavingAssignments}
            >
              {isSavingAssignments ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by path or description..."
            maxWidth="max-w-none"
            className="mb-0! flex-1 min-w-48"
          />
          <SelectDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            className="w-48"
          />
          {groups.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAllGroups}
              className="text-xs text-brand font-medium hover:text-brand-strong transition-colors cursor-pointer whitespace-nowrap"
            >
              {areAllCollapsed ? 'Expand all' : 'Collapse all'}
            </button>
          )}
        </div>
      </div>
      {groups.length === 0 ? (
        <p className="text-sm text-subtle italic text-center py-8 px-4">
          {securedEndpoints.length === 0
            ? 'No secured endpoints found'
            : 'No endpoints match your search'}
        </p>
      ) : (
        <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
          {groups.map(({ label, endpoints }) => (
            <CategoryPanel
              key={label}
              label={label}
              endpoints={endpoints}
              isCollapsed={collapsedGroups.has(label)}
              pendingAssignments={pendingAssignments}
              disabled={isSavingAssignments}
              onToggleCollapse={() => handleToggleGroup(label)}
              onToggleEndpoint={onToggleEndpoint}
              onScopeChange={onScopeChange}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

export default RoleDetailsPanel
