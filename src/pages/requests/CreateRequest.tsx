import { useGetPrefixRequest } from '@/hooks/usePrefixRequests'
import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import { Navigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import { emptyRequestForm } from '@/utils/prefixRequests'
import RequestForm from './RequestForm'
import type { PrefixRequest, RequestFormData } from '@/types/prefixRequests'

const toFormData = (request: PrefixRequest): RequestFormData => ({
  contactPersonName: request.contact_person_name,
  contactPersonSurname: request.contact_person_surname,
  contactPersonEmail: request.contact_person_email,
  contactPersonPhone: request.contact_person_phone ?? '',
  country: request.country,
  organizationName: request.organization_name,
  projectName: request.project_name,
  projectUrl: request.project_url,
  projectDescription: request.project_description ?? '',
  expectedHandles: request.expected_handles,
})

const CreateRequest = () => {
  const { id } = useParams<{ id?: string }>()
  const isEditMode = Boolean(id)
  const requestId = Number(id)
  const { isSuperAdmin, isProviderAdmin, rolesReady } = useAuth()
  const isMember = !isSuperAdmin && !isProviderAdmin
  const isProviderOnly = isProviderAdmin && !isSuperAdmin

  const { data: profile, isLoading: isLoadingProfile } = useGetUserProfile(
    !isEditMode && isMember,
  )
  const {
    data: request,
    isLoading: isLoadingRequest,
    error,
  } = useGetPrefixRequest(
    requestId,
    isEditMode && rolesReady && !isProviderOnly,
  )

  if (rolesReady && isProviderOnly) {
    return <Navigate to="/requests" replace />
  }

  if (request && request.status !== 'PENDING') {
    return <Navigate to={`/requests/${request.id}/details`} replace />
  }

  return (
    <div className="page-container">
      <PageHeader
        title={isEditMode ? 'Edit request' : 'Request a prefix'}
        subtitle={
          isEditMode ? (
            <>
              Update the request
              {request?.project_name && (
                <strong> {request.project_name}</strong>
              )}
            </>
          ) : isMember ? (
            'Describe your organisation and project. An administrator reviews the request and assigns a provider to it'
          ) : (
            'Enter the details of the organisation that asked for a prefix'
          )
        }
        navigateTo={
          isEditMode
            ? { label: 'Back to request', to: `/requests/${id}/details` }
            : {
                label: isMember ? 'Back to my requests' : 'Back to requests',
                to: '/requests',
              }
        }
        className="mb-4"
      />

      {!rolesReady || isLoadingProfile || isLoadingRequest ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="request" />
      ) : isEditMode ? (
        request && (
          <RequestForm
            initialValues={toFormData(request)}
            requestId={request.id}
          />
        )
      ) : (
        <RequestForm
          initialValues={{
            ...emptyRequestForm,
            ...(isMember && {
              contactPersonName: profile?.name ?? '',
              contactPersonSurname: profile?.surname ?? '',
              contactPersonEmail: profile?.email ?? '',
            }),
          }}
        />
      )}
    </div>
  )
}

export default CreateRequest
