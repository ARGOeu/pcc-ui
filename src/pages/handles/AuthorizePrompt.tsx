import { useState } from 'react'
import { useHandleAccess } from '@/auth/useHandleAccess'
import { LockClosedIcon } from '@heroicons/react/16/solid'
import Button from '@/components/Button'
import AuthorizeDialog from './AuthorizeDialog'
import type { HandleAccess } from '@/types/handles'

interface AuthorizePromptProps {
  providerId: number
  prefixId: number
  rejectedMessage?: string
}

const AuthorizePrompt = ({
  providerId,
  prefixId,
  rejectedMessage,
}: AuthorizePromptProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { access, setAccess } = useHandleAccess(prefixId)

  const handleAuthorized = (newAccess: HandleAccess) => {
    setAccess(newAccess)
    setDialogOpen(false)
  }

  return (
    <>
      {rejectedMessage && access && (
        <div
          role="alert"
          className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500 bg-amber-100 px-3 py-2 text-sm text-amber-700"
        >
          <LockClosedIcon className="size-4 shrink-0" />
          <span>
            {rejectedMessage} Enter the token of{' '}
            <strong className="font-mono font-medium">
              {access.account.username}
            </strong>{' '}
            again to continue
          </span>
        </div>
      )}
      <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-white px-4 py-5 text-center shadow-xs">
        <p className="text-sm italic text-muted">
          Authorise with a Handle service account to continue
        </p>
        <Button variant="outline-primary" onClick={() => setDialogOpen(true)}>
          Authorise
        </Button>
      </div>
      {dialogOpen && (
        <AuthorizeDialog
          providerId={providerId}
          prefixId={prefixId}
          onAuthorized={handleAuthorized}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  )
}

export default AuthorizePrompt
