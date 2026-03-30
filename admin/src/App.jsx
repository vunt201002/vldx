import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import AdminLayout from '@/layout/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import MenuManager from '@/pages/MenuManager'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import BlockLibrary from '@/pages/BlockLibrary'
import BlockPreview from '@/pages/BlockPreview'
import ThemeEditor from '@/pages/ThemeEditor'
import Blogs from '@/pages/Blogs'
import BlogDetail from '@/pages/BlogDetail'
import Login from '@/pages/Login'
import AuditLog from '@/pages/AuditLog'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menus" element={<MenuManager />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogDetail />} />
        <Route path="blocks" element={<BlockLibrary />} />
        <Route path="blocks/preview" element={<BlockPreview />} />
        <Route path="theme-editor" element={<ThemeEditor />} />
        <Route path="theme-editor/:slug" element={<ThemeEditor />} />
        <Route path="audit-log" element={<AuditLog />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
