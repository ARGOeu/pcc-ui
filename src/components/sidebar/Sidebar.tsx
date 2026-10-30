import { useGetUserProfile } from '@/hooks/useProfile'
import { useGetUserInvitations } from '@/hooks/useInvitations'
import { useGetPrefixRequests } from '@/hooks/usePrefixRequests'
import { useAuth } from '@/auth/useAuth'
import { useLocation } from 'react-router-dom'
import { TagIcon } from '@heroicons/react/16/solid'
import SidebarNavItem from '@/components/sidebar/SidebarNavItem'
import SidebarSectionLabel from '@/components/sidebar/SidebarSectionLabel'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SidebarFooter from '@/components/sidebar/SidebarFooter'
import { countPendingRequests } from '@/utils/prefixRequests'

interface SidebarProps {
  isMobileMenuOpen: boolean
  onCloseMobileMenu: () => void
}

const Sidebar = ({ isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) => {
  const { authenticated, logout, isSuperAdmin, isProviderAdmin, rolesReady } =
    useAuth()
  const { pathname } = useLocation()
  const { data: profile } = useGetUserProfile()
  const { data: invitations } = useGetUserInvitations(1, 100, authenticated, {
    refetchInterval: 60 * 1000,
    staleTime: 0,
  })
  const pendingCount =
    invitations?.content.filter((invitation) => invitation.status === 'PENDING')
      .length ?? 0
  const { data: prefixRequests } = useGetPrefixRequests(isSuperAdmin)
  const pendingRequestsCount = countPendingRequests(prefixRequests)
  const hasAdminRole = isSuperAdmin || isProviderAdmin
  const isRequestsActive = /^\/requests(\/|$)/.test(pathname)

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
        <nav className="flex flex-1 flex-col gap-0.5 p-4">
          {hasAdminRole && (
            <SidebarNavItem
              to="/dashboard"
              label="Dashboard"
              onClick={onCloseMobileMenu}
            />
          )}
          <SidebarNavItem
            to="/prefixes"
            label="Prefixes"
            onClick={onCloseMobileMenu}
          />
          <SidebarNavItem
            to="/handles"
            label="Handles"
            active={/\/(handles(\/|$)|create-handle$)/.test(pathname)}
            onClick={onCloseMobileMenu}
          />
          <SidebarNavItem
            to="/providers"
            label="Providers"
            active={/^\/providers(\/add|\/\d+\/edit)?\/?$/.test(pathname)}
            onClick={onCloseMobileMenu}
          />
          {hasAdminRole && (
            <SidebarNavItem
              to="/requests"
              label="Requests"
              badge={pendingRequestsCount}
              active={isRequestsActive}
              onClick={onCloseMobileMenu}
            />
          )}
          <div className="flex flex-col gap-0.5">
            <SidebarSectionLabel>Account</SidebarSectionLabel>
            <SidebarNavItem
              to="/my-invitations"
              label="My invitations"
              badge={pendingCount}
              onClick={onCloseMobileMenu}
            />
            {rolesReady && !hasAdminRole && (
              <SidebarNavItem
                to="/requests"
                label="My requests"
                active={isRequestsActive}
                onClick={onCloseMobileMenu}
              />
            )}
          </div>
          {isSuperAdmin && (
            <div>
              <SidebarSectionLabel>Admin</SidebarSectionLabel>
              <SidebarNavItem
                to="/endpoints-access"
                label="Endpoints access"
                onClick={onCloseMobileMenu}
              />
            </div>
          )}
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
