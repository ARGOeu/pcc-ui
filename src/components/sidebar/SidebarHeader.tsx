import { Link } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/16/solid'

interface SidebarHeaderProps {
  onCloseMobileMenu: () => void
}

const SidebarHeader = ({ onCloseMobileMenu }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-1 border-b border-line px-4 pt-1 pb-2">
      <Link to="/" className="flex items-center gap-2 py-1 ps-2">
        <img
          src="/logo.png"
          alt="PID Central Catalogue logo"
          className="h-16 w-auto"
        />
      </Link>

      <button
        aria-label="Close menu"
        className="cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-surface-strong md:hidden"
        onClick={onCloseMobileMenu}
      >
        <XMarkIcon className="size-6" />
      </button>
    </div>
  )
}

export default SidebarHeader
