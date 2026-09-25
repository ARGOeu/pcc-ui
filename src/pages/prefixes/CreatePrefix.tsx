import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreatePrefixMutation,
  useGetPrefix,
  usePatchPrefixMutation,
} from '@/hooks/usePrefixes'
import { useGetProviders } from '@/hooks/useProviders'
import { useGetDomains } from '@/hooks/useDomains'
import {
  useGetContractTypes,
  useGetLookupServiceTypes,
} from '@/hooks/useCodelist'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SelectDropdown from '@/components/SelectDropdown'
import capitalizeWord from '@/utils/capitalizeWord'

const sectionClass =
  'grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-2 lg:gap-8 mb-6 animate-fade-in'
const sectionContentClass =
  'bg-surface-muted border border-line rounded-lg px-5 py-3 flex flex-col justify-center gap-2'
const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

interface FormData {
  name: string
  owner: string
  contactName: string
  contactEmail: string
  usedBy: string
  providerId: string
  serviceName: string
  domainId: string
  contractTypeId: string
  lookupServiceTypeId: string
  contractEnd: string
  resolvable: boolean
}

interface FormErrors {
  name: string
  owner: string
  contactName: string
  contactEmail: string
  providerId: string
}

const emptyErrors: FormErrors = {
  name: '',
  owner: '',
  contactName: '',
  contactEmail: '',
  providerId: '',
}

const CreatePrefix = () => {
  const navigate = useNavigate()
  const { id: prefixIdParam } = useParams<{ id?: string }>()
  const isEditMode = Boolean(prefixIdParam)
  const prefixId = prefixIdParam ? Number(prefixIdParam) : undefined

  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useGetProviders()
  const {
    data: domains,
    isLoading: isLoadingDomains,
    error: domainsError,
  } = useGetDomains()
  const {
    data: contractTypes,
    isLoading: isLoadingContractTypes,
    error: contractTypesError,
  } = useGetContractTypes()
  const {
    data: lookupServiceTypes,
    isLoading: isLoadingLookupTypes,
    error: lookupTypesError,
  } = useGetLookupServiceTypes()
  const {
    data: prefixData,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(prefixId ?? 0, isEditMode)

  const createMutation = useCreatePrefixMutation()
  const patchMutation = usePatchPrefixMutation()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    owner: '',
    contactName: '',
    contactEmail: '',
    usedBy: '',
    providerId: '',
    serviceName: '',
    domainId: '',
    contractTypeId: '',
    lookupServiceTypeId: '',
    contractEnd: '',
    resolvable: true,
  })

  const [errors, setErrors] = useState<FormErrors>(emptyErrors)

  useEffect(() => {
    if (isEditMode && prefixData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect, react-x/set-state-in-effect
      setFormData({
        name: prefixData.name,
        owner: prefixData.owner,
        contactName: prefixData.contact_name,
        contactEmail: prefixData.contact_email,
        usedBy: prefixData.used_by ?? '',
        providerId: String(prefixData.provider_id),
        serviceName: prefixData.service_name ?? '',
        domainId: prefixData.domain_id ? String(prefixData.domain_id) : '',
        contractTypeId: prefixData.contract_type_id
          ? String(prefixData.contract_type_id)
          : '',
        lookupServiceTypeId: prefixData.lookup_service_type_id
          ? String(prefixData.lookup_service_type_id)
          : '',
        contractEnd: prefixData.contract_end?.split('T')[0] ?? '',
        resolvable: prefixData.resolvable ?? true,
      })
    }
  }, [isEditMode, prefixData])

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
  ) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field in errors && value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleDropdownChange = (field: keyof FormErrors, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (value) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    const newErrors: FormErrors = { ...emptyErrors }
    let hasError = false

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      hasError = true
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required'
      hasError = true
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
      hasError = true
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
      hasError = true
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
      hasError = true
    }
    if (!formData.providerId) {
      newErrors.providerId = 'Provider is required'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    const payload = {
      name: formData.name.trim(),
      owner: formData.owner.trim(),
      contact_name: formData.contactName.trim(),
      contact_email: formData.contactEmail.trim(),
      provider_id: Number(formData.providerId),
      resolvable: formData.resolvable,
      ...(formData.usedBy.trim() && { used_by: formData.usedBy.trim() }),
      ...(formData.serviceName.trim() && {
        service_name: formData.serviceName.trim(),
      }),
      ...(formData.domainId && { domain_id: Number(formData.domainId) }),
      ...(formData.contractTypeId && {
        contract_type_id: Number(formData.contractTypeId),
      }),
      ...(formData.lookupServiceTypeId && {
        lookup_service_type_id: Number(formData.lookupServiceTypeId),
      }),
      ...(formData.contractEnd && { contract_end: formData.contractEnd }),
    }

    if (isEditMode && prefixId) {
      patchMutation.mutate(
        { id: prefixId, data: payload },
        {
          onSuccess: () => {
            toast.success('Prefix updated successfully!')
            void navigate('/prefixes')
          },
          onError: (error) => {
            toast.error(`Failed to update prefix: ${error.message}`)
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Prefix created successfully!')
          void navigate('/prefixes')
        },
        onError: (error) => {
          toast.error(`Failed to create prefix: ${error.message}`)
        },
      })
    }
  }

  const isSaving = createMutation.isPending || patchMutation.isPending

  return (
    <div className="page-container">
      <PageHeader
        title={isEditMode ? 'Edit Prefix' : 'Create Prefix'}
        subtitle={
          isEditMode ? (
            <>
              Update details for prefix
              {prefixData?.name && <strong> {prefixData.name}</strong>}
            </>
          ) : (
            'Register a new prefix in the catalogue'
          )
        }
        navigateTo={{ label: 'Back to Prefixes', to: '/prefixes' }}
      />

      {isEditMode && isPrefixLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : isEditMode && prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : (
        <>
          <div className="flex justify-end items-center mb-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="xs" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Update prefix'
              ) : (
                'Create prefix'
              )}
            </Button>
          </div>

          {/* Prefix details */}
          <div className={sectionClass}>
            <div className="pt-2 pl-2">
              <p className="section-title">Prefix Details</p>
              <p className="section-description">
                Basic information and contact details for this prefix
              </p>
            </div>
            <div className={sectionContentClass}>
              <div className="flex flex-col">
                <label className={labelClass}>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleTextChange(e, 'name')}
                  placeholder="Enter the prefix name"
                  className={errors.name ? inputErrorClass : ''}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Owner <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleTextChange(e, 'owner')}
                  placeholder="Enter the owner name"
                  className={errors.owner ? inputErrorClass : ''}
                />
                {errors.owner && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.owner}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Contact name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleTextChange(e, 'contactName')}
                  placeholder="Enter the contact person's name"
                  className={errors.contactName ? inputErrorClass : ''}
                />
                {errors.contactName && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.contactName}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>
                  Contact email <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactEmail}
                  onChange={(e) => handleTextChange(e, 'contactEmail')}
                  placeholder="Enter the contact email address"
                  className={errors.contactEmail ? inputErrorClass : ''}
                />
                {errors.contactEmail && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.contactEmail}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Used by</label>
                <input
                  type="text"
                  value={formData.usedBy}
                  onChange={(e) => handleTextChange(e, 'usedBy')}
                  placeholder="Enter the entity or organization using the prefix"
                />
              </div>
            </div>
          </div>

          {/* Service information */}
          <div className={sectionClass}>
            <div className="pt-2 pl-2">
              <p className="section-title">Service Information</p>
              <p className="section-description">
                The provider, service and domain for this prefix
              </p>
            </div>
            <div className={sectionContentClass}>
              <div className="flex flex-col">
                <label className={labelClass}>
                  Provider <span className="required">*</span>
                </label>
                {isLoadingProviders ? (
                  <div className="flex items-center gap-2 text-sm text-muted py-2">
                    <LoadingSpinner size="xs" />
                    Loading providers...
                  </div>
                ) : providersError ? (
                  <ErrorDisplay error={providersError} context="providers" />
                ) : (
                  <SelectDropdown
                    value={formData.providerId}
                    onChange={(value) =>
                      handleDropdownChange('providerId', value)
                    }
                    options={
                      providers?.map((provider) => ({
                        value: String(provider.id),
                        label: provider.name,
                      })) ?? []
                    }
                    placeholder="Select a provider..."
                  />
                )}
                {errors.providerId && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.providerId}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Service</label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => handleTextChange(e, 'serviceName')}
                  placeholder="Enter the service name"
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Domain</label>
                {isLoadingDomains ? (
                  <div className="flex items-center gap-2 text-sm text-muted py-2">
                    <LoadingSpinner size="xs" />
                    Loading domains...
                  </div>
                ) : domainsError ? (
                  <ErrorDisplay error={domainsError} context="domains" />
                ) : (
                  <SelectDropdown
                    value={formData.domainId}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, domainId: value }))
                    }
                    options={[
                      { value: '', label: 'Not set' },
                      ...(domains?.map((domain) => ({
                        value: String(domain.id),
                        label: capitalizeWord(domain.name),
                      })) ?? []),
                    ]}
                    placeholder="Select a scientific domain..."
                    searchable
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contract details */}
          <div className={sectionClass}>
            <div className="pt-2 pl-2">
              <p className="section-title">Contract Details</p>
              <p className="section-description">
                Contract and lookup service details for this prefix
              </p>
            </div>
            <div className={sectionContentClass}>
              <div className="flex flex-col">
                <label className={labelClass}>Contract type</label>
                {isLoadingContractTypes ? (
                  <div className="flex items-center gap-2 text-sm text-muted py-2">
                    <LoadingSpinner size="xs" />
                    Loading contract types...
                  </div>
                ) : contractTypesError ? (
                  <ErrorDisplay
                    error={contractTypesError}
                    context="contract types"
                  />
                ) : (
                  <SelectDropdown
                    value={formData.contractTypeId}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        contractTypeId: value,
                      }))
                    }
                    options={[
                      { value: '', label: 'Not set' },
                      ...(contractTypes?.map((contractType) => ({
                        value: String(contractType.id),
                        label: capitalizeWord(contractType.name),
                      })) ?? []),
                    ]}
                    placeholder="Select a contract type..."
                  />
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Lookup service type</label>
                {isLoadingLookupTypes ? (
                  <div className="flex items-center gap-2 text-sm text-muted py-2">
                    <LoadingSpinner size="xs" />
                    Loading lookup service types...
                  </div>
                ) : lookupTypesError ? (
                  <ErrorDisplay
                    error={lookupTypesError}
                    context="lookup service types"
                  />
                ) : (
                  <SelectDropdown
                    value={formData.lookupServiceTypeId}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        lookupServiceTypeId: value,
                      }))
                    }
                    options={[
                      { value: '', label: 'Not set' },
                      ...(lookupServiceTypes?.map((lookupType) => ({
                        value: String(lookupType.id),
                        label: capitalizeWord(lookupType.name),
                      })) ?? []),
                    ]}
                    placeholder="Select a lookup service type..."
                  />
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Contract end date</label>
                <input
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => handleTextChange(e, 'contractEnd')}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                />
              </div>
            </div>
          </div>

          {/* Resolvability */}
          <div className={sectionClass}>
            <div className="pt-2 pl-2">
              <h2 className="section-title">Resolvability</h2>
              <p className="section-description">
                Indicates whether this prefix is expected to be resolvable
              </p>
            </div>
            <div className={sectionContentClass}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="text-sm text-muted">
                    Enable or disable resolvability for this prefix
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-body">
                    {formData.resolvable ? 'Enabled' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-brand"
                    checked={formData.resolvable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        resolvable: e.target.checked,
                      }))
                    }
                    aria-label="Enable or disable resolvability"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CreatePrefix
