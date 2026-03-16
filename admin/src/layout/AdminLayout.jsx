import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import '@/styles/layout.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
]

export default function AdminLayout() {
  const location = useLocation()

  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard'
    if (location.pathname.startsWith('/products')) return 'Products'
    return 'Admin Panel'
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          VLXD <span>Admin</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{getPageTitle()}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            VLXD Management System
          </span>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
