import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  to: string
  label: string
  onClick?: () => void
}

const SidebarNavItem = ({ to, label, onClick }: SidebarNavItemProps) => {
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
      {label}
    </NavLink>
  )
}

export default SidebarNavItem
