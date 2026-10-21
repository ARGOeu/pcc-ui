import { useState } from 'react'
import { useGetAccounts } from '@/hooks/useAccounts'
import { useGetPrefix } from '@/hooks/usePrefixes'
import { useAuthorizeHandleServiceMutation } from '@/hooks/useHandles'
import { GlobeAltIcon, UserIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorDisplay from '@/components/ErrorDisplay'
import type { FormEvent } from 'react'
import type { Account } from '@/types/accounts'
import type { HandleAccess } from '@/types/handles'

interface AuthorizeDialogProps {
  providerId: number
  prefixId: number
  onAuthorized: (access: HandleAccess) => void
  onClose: () => void
}

const AuthorizeDialog = ({
  providerId,
  prefixId,
  onAuthorized,
  onClose,
}: AuthorizeDialogProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [handleToken, setHandleToken] = useState('')

  const {
    data: accountsData,
    isLoading,
    error: accountsError,
  } = useGetAccounts(providerId, prefixId, 1, 100)
  const { data: prefix } = useGetPrefix(providerId, prefixId, true)
  const authorizeMutation = useAuthorizeHandleServiceMutation()

  const accounts = accountsData?.content ?? []
  const selectedAccount: Account | undefined =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const authorizeError = authorizeMutation.error
  const isPrefixNotFound =
    !!accountsError &&
    'notFound' in accountsError &&
    accountsError.notFound === true
  const isPending = authorizeMutation.isPending

  const handleTokenChange = (value: string) => {
    setHandleToken(value)
    authorizeMutation.reset()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedAccount) {
      return
    }
    authorizeMutation.mutate(
      { providerId, prefixId, account: selectedAccount, handleToken },
      {
        onSuccess: () => {
          onAuthorized({
            account: selectedAccount,
            token: handleToken,
            authorizedAt: Date.now(),
          })
          toast.success(`Authorized as ${selectedAccount.username}`)
        },
      },
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4"
      onClick={isPending ? undefined : onClose}
    >
      <form
        className="bg-white rounded-lg shadow-xl max-w-120 w-full overflow-hidden mb-32"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
          <h3 className="text-xl font-semibold text-foreground m-0">
            Connect to the Handle service
          </h3>
          <button
            type="button"
            className="p-1 rounded-full text-muted bg-transparent border-none cursor-pointer transition-colors hover:bg-surface-strong hover:text-foreground"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isPending}
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-5 py-2">
          <p className="text-sm text-muted">
            Choose the Handle service account to use and enter its token
          </p>

          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner size="sm" />
            </div>
          ) : accountsError && !isPrefixNotFound ? (
            <ErrorDisplay error={accountsError} context="accounts" />
          ) : accounts.length === 0 ? (
            <p className="text-sm italic text-muted">
              No Handle service accounts found
              {prefix && (
                <>
                  {' '}
                  for prefix{' '}
                  <strong className="font-mono font-medium not-italic">
                    {prefix.name}
                  </strong>
                </>
              )}
            </p>
          ) : (
            <>
              <fieldset className="flex flex-col gap-1.5 border-0 p-0 m-0">
                <legend className="text-sm font-medium text-body mb-0.5">
                  Select a Handle service account
                  {prefix && (
                    <>
                      {' '}
                      for prefix{' '}
                      <strong className="font-mono font-medium">
                        {prefix.name}
                      </strong>
                    </>
                  )}{' '}
                  <span className="required">*</span>
                </legend>
                {accounts.map((account) => (
                  <label
                    key={account.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-1.5 transition-colors ${
                      account.id === selectedAccount?.id
                        ? 'border-brand bg-brand-subtle'
                        : 'border-line-strong bg-white hover:bg-surface-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="account"
                      checked={account.id === selectedAccount?.id}
                      onChange={() => setSelectedAccountId(account.id)}
                      className="accent-brand"
                    />
                    <span className="min-w-0">
                      <span
                        title="Username"
                        className="flex items-center gap-1.5 font-mono text-sm leading-5 font-medium text-foreground"
                      >
                        <UserIcon className="size-4 shrink-0 text-muted" />
                        {account.username}
                      </span>
                      <span
                        title="Endpoint"
                        className="flex items-start gap-1.5 break-all font-mono text-xs leading-4 text-muted"
                      >
                        <GlobeAltIcon className="size-4 shrink-0" />
                        {account.endpoint}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-body mb-0.5">
                  Token <span className="required">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={handleToken}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="Paste the token of this account"
                  className={authorizeError ? 'border-red-500!' : ''}
                />
                {authorizeError && (
                  <span className="text-xs text-red-500 mt-1">
                    {authorizeError.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between gap-6 px-5 py-3 bg-surface-muted border-t border-line">
          <Button
            type="button"
            onClick={onClose}
            size="sm"
            variant="outline-secondary"
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!selectedAccount || !handleToken.trim() || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <LoadingSpinner size="xs" className="text-white!" />
                Checking...
              </span>
            ) : (
              'Authorize'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AuthorizeDialog
