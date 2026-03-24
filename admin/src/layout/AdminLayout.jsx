import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import '@/styles/layout.css'
import { LayoutContext } from '@/context/LayoutContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/theme-editor', label: 'Theme Editor', icon: '🎨' },
]

export default function AdminLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard'
    if (location.pathname.startsWith('/products')) return 'Products'
    if (location.pathname.startsWith('/theme-editor')) return 'Theme Editor'
    return 'Admin Panel'
  }

  return (
    <div
      className="admin-layout"
      style={{ '--sidebar-width': collapsed ? '60px' : '240px' }}
    >
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-logo">
          {collapsed ? <span>V</span> : <>VLXD <span>Admin</span></>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? '›' : '‹'}
        </button>
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-title">Main Menu</div>}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-label">{item.label}</span>
              <span className="nav-link-tooltip">{item.label}</span>
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
          <LayoutContext.Provider value={{ collapsed, setCollapsed }}>
            <Outlet />
          </LayoutContext.Provider>
        </main>
      </div>
    </div>
  )
}
