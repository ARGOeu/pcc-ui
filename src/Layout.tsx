import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import Sidebar from '@/components/sidebar/Sidebar'
import MenuToggle from '@/components/sidebar/MenuToggle'
import LoginPrompt from '@/components/LoginPrompt'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { initialized, authenticated, login } = useAuth()

  if (!initialized) {
    return null
  }

  if (!authenticated) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-auto bg-white">
          <div className="container md:mx-auto p-4 md:px-6">
            <LoginPrompt
              title="Authentication Required"
              description="Please login to access the PID Central Catalogue"
              onLogin={login}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MenuToggle
        isOpen={isMobileMenuOpen}
        onOpen={() => setIsMobileMenuOpen(true)}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 overflow-auto bg-white">
        <div className="container px-4 py-2 md:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
