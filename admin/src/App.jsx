import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/layout/AdminLayout'
import Dashboard from '@/pages/Dashboard'
import MenuManager from '@/pages/MenuManager'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import BlockLibrary from '@/pages/BlockLibrary'
import BlockPreview from '@/pages/BlockPreview'
import ThemeEditor from '@/pages/ThemeEditor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menus" element={<MenuManager />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="blocks" element={<BlockLibrary />} />
        <Route path="blocks/preview" element={<BlockPreview />} />
        <Route path="theme-editor" element={<ThemeEditor />} />
        <Route path="theme-editor/:slug" element={<ThemeEditor />} />
      </Route>
    </Routes>
  )
}
