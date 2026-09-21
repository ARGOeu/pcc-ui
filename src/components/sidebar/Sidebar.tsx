import { TagIcon } from '@heroicons/react/16/solid'
import { useGetUserProfile } from '@/hooks/useProfile'
import { useAuth } from '@/auth/useAuth'
import SidebarNavItem from '@/components/sidebar/SidebarNavItem'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SidebarFooter from '@/components/sidebar/SidebarFooter'

interface SidebarProps {
  isMobileMenuOpen: boolean
  onCloseMobileMenu: () => void
}

const Sidebar = ({ isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) => {
  const { authenticated, logout } = useAuth()
  const { data: profile } = useGetUserProfile()

  return (
    <aside
      className={`w-56 md:w-60 xl:w-68 2xl:w-72 bg-surface-muted border-r border-line flex flex-col fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen
          ? 'translate-x-0'
          : '-translate-x-full md:translate-x-0'
      }`}
    >
      <SidebarHeader onCloseMobileMenu={onCloseMobileMenu} />

      {authenticated ? (
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <SidebarNavItem
            to="/prefixes"
            label="Prefixes"
            onClick={onCloseMobileMenu}
          />
        </nav>
      ) : (
        <div className="flex-1 flex items-start justify-center px-6 pt-20">
          <div className="text-center text-muted text-sm">
            <TagIcon className="size-12 mx-auto mb-3 text-brand" />
            <p className="font-medium text-body mb-1">PID Central Catalogue</p>
            <p>Please login to access the application</p>
          </div>
        </div>
      )}

      {authenticated && <SidebarFooter profile={profile} onLogout={logout} />}
    </aside>
  )
}

export default Sidebar
