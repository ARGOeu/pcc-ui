import { useEffect, useState } from 'react'
import { useGetPrefix } from '@/hooks/usePrefixes'
import {
  useCreateHandleMutation,
  useGetHandle,
  useUpdateHandleMutation,
} from '@/hooks/useHandles'
import { useValidateUrlMutation } from '@/hooks/useValidation'
import { useHandleAccess } from '@/auth/useHandleAccess'
import { isTokenRejected } from '@/api/handles'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import AuthorizePrompt from './AuthorizePrompt'
import {
  getCustomFields,
  getHandleSuffix,
  getTargetUrl,
  urlValueType,
} from '@/utils/handleValues'
import {
  validateFieldKey,
  validateFieldValue,
  validateSuffix,
  validateUrl,
} from '@/utils/validateHandle'
import type { FormEvent } from 'react'

const labelClass = 'text-base font-medium text-body'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'
const errorTextClass = 'text-xs text-red-500 mt-1'

interface FormData {
  suffix: string
  url: string
}

interface FieldRow {
  id: string
  key: string
  value: string
  keyError: string
  valueError: string
}

const emptyForm: FormData = { suffix: '', url: '' }

const validators: Record<keyof FormData, (value: string) => string> = {
  suffix: validateSuffix,
  url: validateUrl,
}

const createRow = (key = '', value = ''): FieldRow => ({
  id: crypto.randomUUID(),
  key,
  value,
  keyError: '',
  valueError: '',
})

const CreateHandle = () => {
  const {
    providerId: providerIdParam,
    id,
    suffix: suffixParam,
  } = useParams<{
    providerId: string
    id: string
    suffix?: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const isEditMode = Boolean(suffixParam)
  const handlesPath = `/providers/${providerId}/prefixes/${prefixId}/handles`
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const suffixFromSearch = isEditMode ? '' : (searchParams.get('suffix') ?? '')

  const [formData, setFormData] = useState<FormData>(() => ({
    ...emptyForm,
    suffix: suffixFromSearch,
  }))
  const [errors, setErrors] = useState<FormData>(() => ({
    ...emptyForm,
    suffix: suffixFromSearch ? validateSuffix(suffixFromSearch) : '',
  }))
  const [fields, setFields] = useState<FieldRow[]>([])

  const { access } = useHandleAccess(prefixId)
  const {
    data: prefix,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(providerId, prefixId, !!id)
  const {
    data: handle,
    isLoading: isHandleLoading,
    error: handleError,
  } = useGetHandle(providerId, prefixId, suffixParam ?? '', access, isEditMode)
  const createMutation = useCreateHandleMutation()
  const updateMutation = useUpdateHandleMutation()
  const verifyMutation = useValidateUrlMutation()

  useEffect(() => {
    if (handle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect, react-x/set-state-in-effect
      setFormData({
        suffix: getHandleSuffix(handle.handle),
        url: getTargetUrl(handle) ?? '',
      })
      // eslint-disable-next-line react-x/set-state-in-effect
      setFields(
        getCustomFields(handle).map((field) =>
          createRow(field.key, field.value),
        ),
      )
    }
  }, [handle])

  const isFormValid =
    (isEditMode || !validateSuffix(formData.suffix)) &&
    !validateUrl(formData.url) &&
    fields.every(
      (row) => !validateFieldKey(row.key) && !validateFieldValue(row.value),
    )
  const isSaving = createMutation.isPending || updateMutation.isPending
  const resolvedName = `${prefix?.name ?? ''}/${formData.suffix}`

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }))
    if (name === 'url') {
      verifyMutation.reset()
    }
  }

  const handleVerify = () => {
    verifyMutation.mutate({ url: formData.url.trim() })
  }

  const handleFieldKeyChange = (rowId: string, value: string) => {
    setFields((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, key: value, keyError: validateFieldKey(value) }
          : row,
      ),
    )
  }

  const handleFieldValueChange = (rowId: string, value: string) => {
    setFields((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, value, valueError: validateFieldValue(value) }
          : row,
      ),
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!access) {
      return
    }
    const values = [
      { type: urlValueType, value: formData.url.trim() },
      ...fields.map((row) => ({
        type: row.key.trim(),
        value: row.value.trim(),
      })),
    ]

    if (isEditMode && suffixParam) {
      updateMutation.mutate(
        {
          providerId,
          prefixId,
          suffix: suffixParam,
          access,
          data: { values },
        },
        {
          onSuccess: () => {
            toast.success('Handle updated successfully!')
            void navigate(handlesPath)
          },
          onError: (error) => {
            toast.error(`Failed to update handle: ${error.message}`)
          },
        },
      )
    } else {
      createMutation.mutate(
        {
          providerId,
          prefixId,
          access,
          data: { suffix: formData.suffix, values },
        },
        {
          onSuccess: () => {
            toast.success('Handle added successfully!')
            void navigate(handlesPath)
          },
          onError: (error) => {
            toast.error(`Failed to add handle: ${error.message}`)
          },
        },
      )
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={isEditMode ? 'Edit handle' : 'Add handle'}
        subtitle={
          isEditMode ? (
            <>
              Update the handle{' '}
              <strong className="font-mono">{resolvedName}</strong>
            </>
          ) : (
            <>
              Add a handle to prefix
              {prefix?.name && (
                <strong className="font-mono"> {prefix.name}</strong>
              )}
            </>
          )
        }
        navigateTo={{ label: 'Back to handles', to: handlesPath }}
        className="mb-4"
      />

      {prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : !access || isTokenRejected(handleError) ? (
        <AuthorizePrompt
          providerId={providerId}
          prefixId={prefixId}
          rejectedMessage={
            isTokenRejected(handleError) ? handleError?.message : undefined
          }
        />
      ) : isPrefixLoading || (isEditMode && isHandleLoading) ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : isEditMode && handleError ? (
        <ErrorDisplay error={handleError} context="handle" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-3xl">
          <Card
            footer={
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline-secondary"
                  size="md"
                  href={handlesPath}
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
                      {isEditMode ? 'Saving...' : 'Adding...'}
                    </>
                  ) : isEditMode ? (
                    'Save changes'
                  ) : (
                    'Add handle'
                  )}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              <div className="flex flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <label className={`${labelClass} mb-0.5`}>
                    Suffix <span className="required">*</span>
                  </label>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() =>
                        handleChange('suffix', crypto.randomUUID())
                      }
                      className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] leading-4 font-medium text-brand hover:text-brand-strong"
                    >
                      <ArrowPathIcon className="size-3.5" />
                      Generate UUID
                    </button>
                  )}
                </div>
                <div className="flex items-stretch">
                  <span className="flex items-center rounded-l-md border border-r-0 border-line-strong bg-surface-strong px-3 font-mono text-sm text-muted">
                    {prefix?.name}/
                  </span>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => handleChange('suffix', e.target.value)}
                    disabled={isEditMode}
                    placeholder="Enter the suffix of the handle"
                    className={`min-w-0 flex-1 rounded-l-none ${errors.suffix ? inputErrorClass : ''}`}
                  />
                </div>
                {errors.suffix ? (
                  <span className={errorTextClass}>{errors.suffix}</span>
                ) : (
                  <span className="text-xs text-muted mt-1">
                    Will resolve to:{' '}
                    <span className="font-mono text-body">{resolvedName}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={`${labelClass} mb-0.5`}>
                  Target URL <span className="required">*</span>
                </label>
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder="https://..."
                    className={`min-w-0 flex-1 ${errors.url ? inputErrorClass : ''}`}
                  />
                  <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleVerify}
                    disabled={
                      !!validateUrl(formData.url) || verifyMutation.isPending
                    }
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <LoadingSpinner size="xs" className="size-5!" />
                        Verifying
                      </>
                    ) : (
                      'Verify'
                    )}
                  </Button>
                </div>
                {errors.url ? (
                  <span className={errorTextClass}>{errors.url}</span>
                ) : verifyMutation.data?.reachable ? (
                  <span className="mt-1 text-xs text-emerald-700">
                    The URL is reachable
                  </span>
                ) : verifyMutation.data ? (
                  <span className="mt-1 text-xs text-red-600">
                    The URL could not be reached. You can still save the handle
                  </span>
                ) : verifyMutation.error ? (
                  <span className="mt-1 text-xs text-red-600">
                    The URL could not be checked now. You can still save the
                    handle
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <div>
                  <h2 className={labelClass}>Custom fields</h2>
                  <p className="section-description text-[13px]">
                    Add extra values to the handle as key and value pairs
                  </p>
                </div>

                {fields.length > 0 && (
                  <div className="grid grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)_auto] items-center gap-x-1.5 gap-y-2">
                    {fields.map((row, index) => (
                      <div key={row.id} className="contents">
                        <input
                          type="text"
                          value={row.key}
                          onChange={(e) =>
                            handleFieldKeyChange(row.id, e.target.value)
                          }
                          aria-label={`Key of field ${index + 1}`}
                          placeholder="Key"
                          className={row.keyError ? inputErrorClass : ''}
                        />
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) =>
                            handleFieldValueChange(row.id, e.target.value)
                          }
                          aria-label={`Value of field ${index + 1}`}
                          placeholder="Value"
                          className={row.valueError ? inputErrorClass : ''}
                        />
                        <IconButton
                          icon={<XMarkIcon className="size-5" />}
                          label=""
                          onClick={() =>
                            setFields((prev) =>
                              prev.filter((item) => item.id !== row.id),
                            )
                          }
                          className="tooltip-left text-muted hover:bg-surface-strong"
                        />
                        {(row.keyError || row.valueError) && (
                          <span
                            className={`${errorTextClass} col-span-3 -mt-1`}
                          >
                            {row.keyError || row.valueError}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setFields((prev) => [...prev, createRow()])}
                  >
                    Add field
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

export default CreateHandle
