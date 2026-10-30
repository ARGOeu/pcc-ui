import { useEffect, useState } from 'react'
import {
  useCreateProviderMutation,
  useGetProvider,
  useUpdateProviderMutation,
} from '@/hooks/useProviders'
import { useGetContactTypes } from '@/hooks/useCodelist'
import { useNavigate, useParams } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import SelectDropdown from '@/components/SelectDropdown'
import validateEmail from '@/utils/validateEmail'
import { getContactTypeLabel } from '@/utils/contactTypes'
import ProviderLogoField from './ProviderLogoField'
import type { FormEvent } from 'react'
import type { ProviderRequest } from '@/types/providers'

const labelClass = 'text-base font-medium text-body'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'
const errorTextClass = 'text-xs text-red-500 mt-1'

const BACKEND_API = import.meta.env.VITE_BACKEND_URI

const providersPath = '/providers'
const descriptionMaxLength = 255

const isExternalLogo = (logo: string): boolean =>
  !logo.startsWith(`${BACKEND_API.replace(/\/+$/, '')}/logos/`)

interface FormData {
  name: string
  description: string
  logo: string
}

interface ContactRow {
  id: string
  name: string
  email: string
  type: string
  nameError: string
  emailError: string
}

const emptyForm: FormData = { name: '', description: '', logo: '' }

const validateProviderName = (value: string): string =>
  value.trim() ? '' : 'Provider name is required'

const validateContactName = (value: string): string =>
  value.trim() ? '' : 'Contact name is required'

const validators: Record<keyof FormData, (value: string) => string> = {
  name: validateProviderName,
  description: () => '',
  logo: () => '',
}

const createRow = (type = '', name = '', email = '') => ({
  id: crypto.randomUUID(),
  name,
  email,
  type,
  nameError: '',
  emailError: '',
})

const CreateProvider = () => {
  const { providerId: providerIdParam } = useParams<{ providerId?: string }>()
  const providerId = Number(providerIdParam)
  const isEditMode = Boolean(providerIdParam)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<FormData>(emptyForm)
  const [contacts, setContacts] = useState<ContactRow[]>(() => [createRow()])

  const {
    data: provider,
    isLoading: isProviderLoading,
    error: providerError,
  } = useGetProvider(providerId, isEditMode)
  const {
    data: contactTypes,
    isLoading: isContactTypesLoading,
    error: contactTypesError,
  } = useGetContactTypes()
  const createMutation = useCreateProviderMutation()
  const updateMutation = useUpdateProviderMutation()

  useEffect(() => {
    if (provider) {
      // eslint-disable-next-line react-hooks/set-state-in-effect, react-x/set-state-in-effect
      setFormData({
        name: provider.name,
        description: provider.description ?? '',
        logo: provider.logo ?? '',
      })
      // A provider needs at least one contact, so an empty one starts with a blank row
      // eslint-disable-next-line react-x/set-state-in-effect
      setContacts(
        provider.contacts.length > 0
          ? provider.contacts.map((contact) =>
              createRow(contact.type, contact.name, contact.email),
            )
          : [createRow()],
      )
    }
  }, [provider])

  const defaultType = contactTypes?.[0] ?? ''
  const contactTypeOptions = (contactTypes ?? []).map((type) => ({
    value: type,
    label: getContactTypeLabel(type),
  }))

  // A row is a duplicate when an earlier row has the same name, email and type
  const contactKeys = contacts.map((row) =>
    [row.name, row.email, row.type || defaultType]
      .map((value) => value.trim().toLowerCase())
      .join('|'),
  )
  const duplicateRowIds = new Set(
    contacts
      .filter(
        (row, index) =>
          (row.name.trim() !== '' || row.email.trim() !== '') &&
          contactKeys.indexOf(contactKeys[index]) < index,
      )
      .map((row) => row.id),
  )

  const isFormValid =
    !validateProviderName(formData.name) &&
    duplicateRowIds.size === 0 &&
    contacts.every(
      (row) => !validateContactName(row.name) && !validateEmail(row.email),
    )
  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }))
  }

  const updateContact = (rowId: string, changes: Partial<ContactRow>) => {
    setContacts((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...changes } : row)),
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const description = formData.description.trim()
    const logoChanged = formData.logo !== (provider?.logo ?? '')

    const data: ProviderRequest = {
      name: formData.name.trim(),
      description: description || undefined,
      ...(logoChanged && { logo: formData.logo || null }),
      contacts: contacts.map((row) => ({
        name: row.name.trim(),
        email: row.email.trim(),
        type: row.type || defaultType,
      })),
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id: providerId, data },
        {
          onSuccess: () => {
            toast.success('Provider updated successfully!')
            void navigate(providersPath)
          },
          onError: (error) => {
            toast.error(`Failed to update provider: ${error.message}`)
          },
        },
      )
    } else {
      createMutation.mutate(
        { data },
        {
          onSuccess: () => {
            toast.success('Provider created successfully!')
            void navigate(providersPath)
          },
          onError: (error) => {
            toast.error(`Failed to create provider: ${error.message}`)
          },
        },
      )
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={isEditMode ? 'Edit provider' : 'Create provider'}
        subtitle={
          isEditMode ? (
            <>
              Update the provider {provider && <strong>{provider.name}</strong>}
            </>
          ) : (
            'Create a provider with its contacts'
          )
        }
        navigateTo={{ label: 'Back to providers', to: providersPath }}
        className="mb-4"
      />

      {(isEditMode && isProviderLoading) || isContactTypesLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : isEditMode && providerError ? (
        <ErrorDisplay error={providerError} context="provider" />
      ) : contactTypesError ? (
        <ErrorDisplay error={contactTypesError} context="contact types" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
          <Card
            footer={
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline-secondary"
                  size="md"
                  href={providersPath}
                  className="my-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!isFormValid || isSaving}
                  className="my-2"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="xs" className="text-white!" />
                      {isEditMode ? 'Saving...' : 'Creating...'}
                    </>
                  ) : isEditMode ? (
                    'Save changes'
                  ) : (
                    'Create provider'
                  )}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2 px-6 py-3">
              <div className="flex flex-col">
                <label className={`${labelClass} mb-0.5`}>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isEditMode}
                  placeholder="Enter the name of the provider"
                  className={errors.name ? inputErrorClass : ''}
                />
                {errors.name && (
                  <span className={errorTextClass}>{errors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div>
                  <h2 className={`${labelClass} leading-5`}>
                    Contacts <span className="required">*</span>
                  </h2>
                  <p className="section-description text-[13px] leading-snug">
                    Add at least one contact person of the provider
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-2">
                  {contacts.map((row, index) => (
                    <div
                      key={row.id}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_9rem_auto] sm:items-start"
                    >
                      <div className="flex flex-col">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) =>
                            updateContact(row.id, {
                              name: e.target.value,
                              nameError: validateContactName(e.target.value),
                            })
                          }
                          aria-label={`Name of contact ${index + 1}`}
                          placeholder="Name"
                          className={row.nameError ? inputErrorClass : ''}
                        />
                        {row.nameError && (
                          <span className={errorTextClass}>
                            {row.nameError}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="email"
                          value={row.email}
                          onChange={(e) =>
                            updateContact(row.id, {
                              email: e.target.value,
                              emailError: validateEmail(e.target.value),
                            })
                          }
                          aria-label={`Email of contact ${index + 1}`}
                          placeholder="Email"
                          className={row.emailError ? inputErrorClass : ''}
                        />
                        {row.emailError && (
                          <span className={errorTextClass}>
                            {row.emailError}
                          </span>
                        )}
                      </div>
                      <SelectDropdown
                        value={row.type || defaultType}
                        onChange={(value) =>
                          updateContact(row.id, { type: value })
                        }
                        options={contactTypeOptions}
                      />
                      <IconButton
                        icon={<XMarkIcon className="size-5" />}
                        label=""
                        onClick={() =>
                          setContacts((prev) =>
                            prev.filter((item) => item.id !== row.id),
                          )
                        }
                        disabled={contacts.length === 1}
                        className="tooltip-left text-muted hover:bg-surface-strong sm:mt-0.5"
                      />
                      {duplicateRowIds.has(row.id) && (
                        <span className={`${errorTextClass} sm:col-span-4`}>
                          This contact already exists
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setContacts((prev) => [...prev, createRow()])
                    }
                  >
                    Add contact
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={`${labelClass} mb-0.5`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={2}
                  maxLength={descriptionMaxLength}
                  placeholder="Describe the provider and its services"
                />
              </div>

              <ProviderLogoField
                value={formData.logo}
                initialUrl={
                  provider?.logo && isExternalLogo(provider.logo)
                    ? provider.logo
                    : ''
                }
                onChange={(logo) => handleChange('logo', logo)}
              />
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

export default CreateProvider
