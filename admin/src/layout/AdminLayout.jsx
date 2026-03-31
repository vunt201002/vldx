import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Menu,
  Package,
  PenLine,
  LayoutGrid,
  Palette,
  ClipboardList,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from 'lucide-react'
import '@/styles/layout.css'
import { LayoutContext } from '@/context/LayoutContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/menus', label: 'Menus', icon: Menu },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/blogs', label: 'Blog', icon: PenLine },
  { to: '/blocks', label: 'Block Library', icon: LayoutGrid },
  { to: '/theme-editor', label: 'Theme Editor', icon: Palette },
  { to: '/audit-log', label: 'Audit Log', icon: ClipboardList },
]

export default function AdminLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard'
    if (location.pathname.startsWith('/menus')) return 'Menus'
    if (location.pathname.startsWith('/products')) return 'Products'
    if (location.pathname.startsWith('/blogs')) return 'Blog'
    if (location.pathname.startsWith('/blocks')) return 'Block Library'
    if (location.pathname.startsWith('/theme-editor')) return 'Theme Editor'
    if (location.pathname.startsWith('/audit-log')) return 'Audit Log'
    return 'Admin Panel'
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/login'
  }

  return (
    <div
      className="admin-layout"
      style={{ '--sidebar-width': collapsed ? '60px' : '240px' }}
    >
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-logo">
          {collapsed ? <span className="logo-mark">V</span> : <>VLXD <span className="logo-accent">Admin</span></>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-title">Main Menu</div>}
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-link-icon">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="nav-link-label">{item.label}</span>
                <span className="nav-link-tooltip">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-email">admin@vlxd.vn</div>
            </div>
          </div>
          <button className="nav-link sidebar-logout" onClick={handleLogout}>
            <span className="nav-link-icon">
              <LogOut size={18} strokeWidth={1.75} />
            </span>
            <span className="nav-link-label">Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{getPageTitle()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="topbar-system">VLXD Management System</span>
            <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>A</div>
          </div>
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
