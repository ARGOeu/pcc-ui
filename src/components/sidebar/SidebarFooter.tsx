import type { UserProfile } from '@/types/profile'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/16/solid'

interface SidebarFooterProps {
  profile?: UserProfile
  onLogout: () => void
}

const SidebarFooter = ({ profile, onLogout }: SidebarFooterProps) => {
  const displayName = profile?.username ?? profile?.email ?? 'User'

  return (
    <div className="border-t border-line">
      <div className="flex items-center justify-between gap-1 px-4 py-4 text-sm text-body">
        <span className="truncate font-medium" title={displayName}>
          {displayName}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="tooltip -m-1 shrink-0 cursor-pointer rounded-lg p-1 transition-colors hover:bg-surface-strong"
          data-tip="Logout"
        >
          <ArrowLeftStartOnRectangleIcon className="size-5 text-muted" />
        </button>
      </div>
    </div>
  )
}

export default SidebarFooter
