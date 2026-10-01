import { useEffect, useState } from 'react'
import { useGetRoles } from '@/hooks/useRoles'
import {
  useAssignEndpointsToRoleMutation,
  useGetAllRoleAssignedEndpoints,
  useGetRoleAssignedEndpoints,
  useGetSecuredEndpoints,
} from '@/hooks/useSecuredEndpoints'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import ConfirmDialog from '@/components/ConfirmDialog'
import RoleListPanel from './RoleListPanel'
import RoleDetailsPanel from './RoleDetailsPanel'
import type { Role } from '@/types/roles'
import type { Scope } from '@/types/securedEndpoints'

type PanelMode = 'assign' | 'create' | 'edit'

const EndpointsAccess = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>('assign')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [pendingAssignments, setPendingAssignments] = useState<
    Record<string, Scope>
  >({})
  const [originalAssignments, setOriginalAssignments] = useState<
    Record<string, Scope>
  >({})
  const [isDirty, setIsDirty] = useState(false)
  const [loadedRoleId, setLoadedRoleId] = useState<string | null>(null)
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useGetRoles()
  const roles = rolesData?.filter((role) => role.name !== 'members')
  const effectiveSelectedRoleId = selectedRoleId ?? roles?.[0]?.id ?? null
  const {
    data: securedEndpoints,
    isLoading: isLoadingEndpoints,
    error: endpointsError,
  } = useGetSecuredEndpoints()
  const { data: assignedData } = useGetRoleAssignedEndpoints(
    effectiveSelectedRoleId ?? '',
    !!effectiveSelectedRoleId,
  )
  const { data: allAssignedData } = useGetAllRoleAssignedEndpoints()
  const assignMutation = useAssignEndpointsToRoleMutation()

  const actionCounts: Record<string, number> = {}
  allAssignedData?.assignments?.forEach((assignment) => {
    actionCounts[assignment.role_id] = assignment.secured_endpoints?.length ?? 0
  })
  if (
    isDirty &&
    effectiveSelectedRoleId &&
    loadedRoleId === effectiveSelectedRoleId
  ) {
    actionCounts[effectiveSelectedRoleId] =
      Object.keys(pendingAssignments).length
  }

  useEffect(() => {
    if (!effectiveSelectedRoleId) {
      return
    }
    const roleAssignment = assignedData?.assignments?.find(
      (assignment) => assignment.role_id === effectiveSelectedRoleId,
    )
    const seeded: Record<string, Scope> = {}
    roleAssignment?.secured_endpoints?.forEach((endpoint) => {
      seeded[endpoint.secured_endpoint_id] = endpoint.scope
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect, react-x/set-state-in-effect
    setPendingAssignments(seeded)
    // eslint-disable-next-line react-x/set-state-in-effect
    setOriginalAssignments(seeded)
    // eslint-disable-next-line react-x/set-state-in-effect
    setIsDirty(false)
    // eslint-disable-next-line react-x/set-state-in-effect
    setLoadedRoleId(effectiveSelectedRoleId)
  }, [assignedData, effectiveSelectedRoleId])

  const guardNavigation = (action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action)
      setDiscardDialogOpen(true)
      return
    }
    action()
  }

  const handleSelectRole = (roleId: string) => {
    guardNavigation(() => {
      setSelectedRoleId(roleId)
      setPanelMode('assign')
    })
  }

  const handleAddRole = () => {
    guardNavigation(() => {
      setEditingRole(null)
      setPanelMode('create')
    })
  }

  const handleEditRole = (role: Role) => {
    guardNavigation(() => {
      setEditingRole(role)
      setSelectedRoleId(role.id)
      setPanelMode('edit')
    })
  }

  const handleDiscardConfirm = () => {
    setDiscardDialogOpen(false)
    pendingAction?.()
    setPendingAction(null)
  }

  const handleDiscardCancel = () => {
    setDiscardDialogOpen(false)
    setPendingAction(null)
  }

  const handleToggleEndpoint = (endpointId: string, defaultScope: Scope) => {
    setPendingAssignments((prev) => {
      const next = { ...prev }
      if (endpointId in next) {
        delete next[endpointId]
      } else {
        next[endpointId] = defaultScope
      }
      return next
    })
    setIsDirty(true)
  }

  const handleScopeChange = (endpointId: string, scope: Scope) => {
    setPendingAssignments((prev) => ({ ...prev, [endpointId]: scope }))
    setIsDirty(true)
  }

  const handleSaveAssignments = () => {
    if (!effectiveSelectedRoleId) {
      return
    }
    const secured_endpoint_assignments = Object.entries(pendingAssignments).map(
      ([secured_endpoint_id, scope]) => ({ secured_endpoint_id, scope }),
    )

    assignMutation.mutate(
      {
        roleId: effectiveSelectedRoleId,
        data: { secured_endpoint_assignments },
      },
      {
        onSuccess: () => {
          toast.success('Role access updated successfully!')
          setIsDirty(false)
        },
        onError: (error) => {
          toast.error(`Failed to update role access: ${error.message}`)
        },
      },
    )
  }

  const handleFormDone = () => {
    setPanelMode('assign')
  }

  const handleCancelForm = () => {
    setPanelMode('assign')
    setEditingRole(null)
  }

  const selectedRole =
    roles?.find((role) => role.id === effectiveSelectedRoleId) ?? null

  return (
    <div className="page-container mb-8">
      <ConfirmDialog
        isOpen={discardDialogOpen}
        title="Discard changes"
        message="You have unsaved changes to this role's access. Discard them?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={handleDiscardConfirm}
        onCancel={handleDiscardCancel}
      />
      <PageHeader
        title="Endpoints access"
        subtitle="Manage which API endpoints each role can access"
        className="mb-4"
      />
      {isLoadingRoles || isLoadingEndpoints ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : rolesError ? (
        <ErrorDisplay error={rolesError} context="roles" />
      ) : endpointsError ? (
        <ErrorDisplay error={endpointsError} context="secured endpoints" />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[22rem_1fr] 2xl:grid-cols-[26rem_1fr] gap-4 items-start">
          <RoleListPanel
            roles={roles ?? []}
            selectedRoleId={
              panelMode === 'create' ? null : effectiveSelectedRoleId
            }
            actionCounts={actionCounts}
            onSelectRole={handleSelectRole}
            onAddRole={handleAddRole}
            onEditRole={handleEditRole}
          />
          <RoleDetailsPanel
            mode={panelMode}
            role={panelMode === 'edit' ? editingRole : selectedRole}
            securedEndpoints={securedEndpoints ?? []}
            pendingAssignments={pendingAssignments}
            originalAssignments={originalAssignments}
            isDirty={isDirty}
            onToggleEndpoint={handleToggleEndpoint}
            onScopeChange={handleScopeChange}
            onSaveAssignments={handleSaveAssignments}
            isSavingAssignments={assignMutation.isPending}
            onFormDone={handleFormDone}
            onCancelForm={handleCancelForm}
          />
        </div>
      )}
    </div>
  )
}

export default EndpointsAccess
