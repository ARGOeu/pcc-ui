import { useGetHandle } from '@/hooks/useHandles'
import { useHandleAccess } from '@/auth/useHandleAccess'
import { isTokenRejected } from '@/api/handles'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import AuthorizePrompt from './AuthorizePrompt'
import formatDate from '@/utils/formatDate'
import {
  getCustomFields,
  getHandleSuffix,
  getLastModified,
  getTargetUrl,
} from '@/utils/handleValues'

const heroLabelClass = 'text-[13px] leading-4 text-muted mb-1.5'

const HandleDetails = () => {
  const {
    providerId: providerIdParam,
    id,
    suffix = '',
  } = useParams<{
    providerId: string
    id: string
    suffix: string
  }>()
  const providerId = Number(providerIdParam)
  const prefixId = Number(id)
  const handlesPath = `/providers/${providerId}/prefixes/${prefixId}/handles`

  const { access } = useHandleAccess(prefixId)
  const {
    data: handle,
    isLoading,
    error,
  } = useGetHandle(providerId, prefixId, suffix, access)

  const targetUrl = handle && getTargetUrl(handle)
  const customFields = handle ? getCustomFields(handle, true) : []
  const lastModified = handle && getLastModified(handle)

  return (
    <div className="page-container">
      <div className="mb-2">
        <PageHeader
          title="Handle details"
          navigateTo={{ label: 'Back to handles', to: handlesPath }}
        >
          {handle && (
            <Button
              variant="outline-primary"
              href={`${handlesPath}/${encodeURIComponent(suffix)}/edit`}
            >
              Edit handle
            </Button>
          )}
        </PageHeader>
        {handle && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-base text-muted">
            <p>
              Handle of prefix{' '}
              <strong className="font-mono">
                {handle.handle.slice(0, handle.handle.indexOf('/'))}
              </strong>
            </p>
            {lastModified && (
              <p>
                Last modified on:{' '}
                <span className="font-semibold">
                  {formatDate({ value: lastModified, includeTime: true })}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {!access || isTokenRejected(error) ? (
        <AuthorizePrompt
          providerId={providerId}
          prefixId={prefixId}
          rejectedMessage={isTokenRejected(error) ? error?.message : undefined}
        />
      ) : isLoading ? (
        <div className="loading-container">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <ErrorDisplay error={error} context="handle" />
      ) : handle ? (
        <>
          <section
            aria-label="Handle and target URL"
            className="flex flex-wrap items-center gap-x-12 gap-y-4 rounded-lg border border-line bg-surface-muted px-6 py-3"
          >
            <div className="min-w-0 flex-[1_1_17.5rem]">
              <p className={heroLabelClass}>Handle</p>
              <p className="break-all font-mono text-xl leading-7">
                <span className="text-muted">
                  {handle.handle.slice(0, handle.handle.indexOf('/') + 1)}
                </span>
                <span className="font-semibold text-foreground">
                  {getHandleSuffix(handle.handle)}
                </span>
              </p>
            </div>
            <div
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-muted"
            >
              <ArrowRightIcon className="size-4.5" />
            </div>
            <div className="min-w-0 flex-[1_1_17.5rem]">
              <p className={heroLabelClass}>Target URL</p>
              {targetUrl && /^https?:\/\//i.test(targetUrl) ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-mono text-base leading-6 text-brand no-underline hover:underline"
                >
                  {targetUrl}
                </a>
              ) : (
                <p className="break-all font-mono text-base leading-6 text-body">
                  {targetUrl ?? 'No target URL'}
                </p>
              )}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="section-title mb-2 flex items-center gap-2">
              Custom fields
              {customFields.length > 0 && (
                <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-medium text-muted">
                  {customFields.length}
                </span>
              )}
            </h2>
            <div className="rounded-lg border border-line bg-white">
              {customFields.length > 0 ? (
                <dl className="divide-y divide-gray-100">
                  {customFields.map((field) => (
                    <div
                      key={field.index}
                      className="grid grid-cols-[minmax(7.5rem,13.75rem)_minmax(0,1fr)] gap-12 px-5 py-2"
                    >
                      <dt className="break-all font-mono text-sm text-muted">
                        {field.key}
                      </dt>
                      <dd className="wrap-break-word text-sm text-foreground">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="px-5 py-4 text-sm text-muted">
                  This handle has no custom fields
                </p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default HandleDetails
