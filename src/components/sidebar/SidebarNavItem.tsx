import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  to: string
  label: string
  badge?: number
  onClick?: () => void
}

const SidebarNavItem = ({ to, label, badge, onClick }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-subtle text-brand'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span className="relative">
        {label}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-4.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.7rem] font-semibold text-white">
            <span aria-hidden>{badge > 99 ? '99+' : badge}</span>
            <span className="sr-only">{badge} pending</span>
          </span>
        )}
      </span>
    </NavLink>
  )
}

export default SidebarNavItem
