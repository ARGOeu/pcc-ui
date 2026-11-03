import { useState } from 'react'
import {
  useGetPrefix,
  useGetPrefixStatistics,
  useSetPrefixStatisticsMutation,
} from '@/hooks/usePrefixes'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import type { FormEvent } from 'react'
import type { PrefixStatisticsRequest } from '@/types/prefixes'

const labelClass = 'text-sm font-medium text-body mb-0.5'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

type FormData = Record<keyof PrefixStatisticsRequest, string>

interface CountField {
  name: keyof FormData
  label: string
  hint: string
  placeholder: string
}

const countFields: CountField[] = [
  {
    name: 'handles_count',
    label: 'Handles',
    hint: 'The total number of handles in the prefix',
    placeholder: 'Enter the total number of handles',
  },
  {
    name: 'resolvable_count',
    label: 'Resolvable',
    hint: 'The number of handles that can be resolved',
    placeholder: 'Enter the number of resolvable handles',
  },
  {
    name: 'unresolvable_count',
    label: 'Unresolvable',
    hint: 'The number of handles that cannot be resolved',
    placeholder: 'Enter the number of unresolvable handles',
  },
  {
    name: 'unchecked_count',
    label: 'Unchecked',
    hint: 'The number of handles that have not been checked yet',
    placeholder: 'Enter the number of unchecked handles',
  },
]

const emptyForm: FormData = {
  handles_count: '',
  resolvable_count: '',
  unresolvable_count: '',
  unchecked_count: '',
}

const validateCount = (label: string, value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) {
    return `${label} is required`
  }
  if (!/^\d+$/.test(trimmed)) {
    return 'Enter a valid number, 0 or higher'
  }
  return ''
}

const SetStatistics = () => {
  const { providerId: providerIdParam, id } = useParams<{
    providerId: string
    id: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const prefixesPath = `/prefixes?provider=${providerId}`
  const navigate = useNavigate()

  const [edits, setEdits] = useState<Partial<FormData>>({})
  const [errors, setErrors] = useState<FormData>(emptyForm)

  const {
    data: prefix,
    isLoading: isPrefixLoading,
    error: prefixError,
  } = useGetPrefix(providerId, prefixId, !!id)
  const { data: statistics, isLoading: isStatisticsLoading } =
    useGetPrefixStatistics(providerId, prefix?.name ?? '', !!prefix)
  const mutation = useSetPrefixStatisticsMutation()

  const savedForm: FormData = statistics
    ? {
        handles_count: String(statistics.handles_count),
        resolvable_count: String(statistics.resolvable_count),
        unresolvable_count: String(statistics.unresolvable_count),
        unchecked_count: String(statistics.unchecked_count),
      }
    : emptyForm
  const formData: FormData = { ...savedForm, ...edits }

  const isFormValid = countFields.every(
    ({ name, label }) => !validateCount(label, formData[name]),
  )

  const handleChange = (field: CountField, value: string) => {
    setEdits((prev) => ({ ...prev, [field.name]: value }))
    setErrors((prev) => ({
      ...prev,
      [field.name]: validateCount(field.label, value),
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prefix) {
      return
    }
    const data: PrefixStatisticsRequest = {
      handles_count: Number(formData.handles_count),
      resolvable_count: Number(formData.resolvable_count),
      unresolvable_count: Number(formData.unresolvable_count),
      unchecked_count: Number(formData.unchecked_count),
    }

    mutation.mutate(
      { providerId, name: prefix.name, data },
      {
        onSuccess: () => {
          toast.success('Statistics saved successfully!')
          void navigate(
            `/providers/${providerId}/prefixes/${prefix.id}/details`,
          )
        },
        onError: (error) => {
          toast.error(`Failed to save statistics: ${error.message}`)
        },
      },
    )
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Prefix statistics"
        subtitle={
          <>
            Set the handle statistics of prefix{' '}
            {prefix?.name && (
              <strong className="font-mono">{prefix.name}</strong>
            )}
          </>
        }
        navigateTo={{ label: 'Back to prefixes', to: prefixesPath }}
        className="mb-4"
      />

      {isPrefixLoading || isStatisticsLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : prefixError ? (
        <ErrorDisplay error={prefixError} context="prefix" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
          <Card
            footer={
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline-secondary"
                  size="md"
                  href={prefixesPath}
                  className="my-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!isFormValid || mutation.isPending}
                  className="my-2"
                >
                  {mutation.isPending ? (
                    <>
                      <LoadingSpinner size="xs" className="text-white!" />
                      Saving...
                    </>
                  ) : (
                    'Save statistics'
                  )}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {countFields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className={labelClass}>
                    {field.label} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    className={errors[field.name] ? inputErrorClass : ''}
                  />
                  {errors[field.name] ? (
                    <span className="text-xs text-red-500 mt-1">
                      {errors[field.name]}
                    </span>
                  ) : (
                    <span className="text-xs text-muted mt-1">
                      {field.hint}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}

export default SetStatistics
