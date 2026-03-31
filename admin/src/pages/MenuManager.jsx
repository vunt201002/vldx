import React, { useState, useEffect } from 'react'
import { get, post, put, del } from '@/lib/api'
import {
  Button,
  Card,
  PageHeader,
  EmptyState,
  Modal,
  FormGroup,
} from '@/components/ui'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  GripVertical,
  ExternalLink,
  Link2,
} from 'lucide-react'

export default function MenuManager() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadMenus()
  }, [])

  const loadMenus = async () => {
    try {
      const response = await get('/menus')
      setMenus(response.data || [])
    } catch (error) {
      console.error('Failed to load menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingMenu({ name: '', handle: '', items: [] })
    setIsCreating(true)
  }

  const handleEdit = (menu) => {
    setEditingMenu({ ...menu })
    setIsCreating(false)
  }

  const handleDelete = async (menuId) => {
    if (!confirm('Are you sure you want to delete this menu?')) return
    try {
      await del(`/menus/${menuId}`)
      await loadMenus()
    } catch (error) {
      alert('Failed to delete menu: ' + error.message)
    }
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        await post('/menus', editingMenu)
      } else {
        await put(`/menus/${editingMenu._id}`, editingMenu)
      }
      setEditingMenu(null)
      setIsCreating(false)
      await loadMenus()
    } catch (error) {
      alert('Failed to save menu: ' + error.message)
    }
  }

  const handleCancel = () => {
    setEditingMenu(null)
    setIsCreating(false)
  }

  const addMenuItem = () => {
    setEditingMenu({
      ...editingMenu,
      items: [
        ...editingMenu.items,
        { label: '', url: '', order: editingMenu.items.length },
      ],
    })
  }

  const updateMenuItem = (index, field, value) => {
    const newItems = [...editingMenu.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditingMenu({ ...editingMenu, items: newItems })
  }

  const removeMenuItem = (index) => {
    const newItems = editingMenu.items.filter((_, i) => i !== index)
    newItems.forEach((item, i) => { item.order = i })
    setEditingMenu({ ...editingMenu, items: newItems })
  }

  const moveMenuItem = (index, direction) => {
    const newItems = [...editingMenu.items]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= newItems.length) return
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    newItems.forEach((item, i) => { item.order = i })
    setEditingMenu({ ...editingMenu, items: newItems })
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner" />
        <span>Loading menus...</span>
      </div>
    )
  }

  return (
    <div className="menu-manager">
      <PageHeader title={`Menus (${menus.length})`}>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Create Menu
        </Button>
      </PageHeader>

      {menus.length === 0 ? (
        <EmptyState
          icon={Menu}
          title="No menus yet"
          description="Create your first navigation menu to get started."
        />
      ) : (
        <div className="menu-grid">
          {menus.map((menu) => (
            <div key={menu._id} className="menu-panel">
              {/* Menu header */}
              <div className="menu-panel-header">
                <div className="menu-panel-info">
                  <div className="menu-panel-icon">
                    <Menu size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="menu-panel-name">{menu.name}</h3>
                    <span className="menu-panel-handle">{menu.handle}</span>
                  </div>
                </div>
                <div className="menu-panel-actions">
                  <button className="menu-action-btn" onClick={() => handleEdit(menu)} title="Edit menu">
                    <Pencil size={14} strokeWidth={1.75} />
                  </button>
                  <button className="menu-action-btn menu-action-btn--danger" onClick={() => handleDelete(menu._id)} title="Delete menu">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Menu items count */}
              <div className="menu-panel-meta">
                <Link2 size={12} strokeWidth={1.75} />
                <span>{menu.items.length} {menu.items.length === 1 ? 'item' : 'items'}</span>
              </div>

              {/* Menu items list */}
              <div className="menu-panel-items">
                {menu.items.map((item, idx) => (
                  <div key={idx} className="menu-item-row">
                    <span className="menu-item-index">{idx + 1}</span>
                    <div className="menu-item-content">
                      <span className="menu-item-label">{item.label}</span>
                      <span className="menu-item-url">{item.url}</span>
                    </div>
                    <ExternalLink size={12} className="menu-item-link-icon" />
                  </div>
                ))}
                {menu.items.length === 0 && (
                  <div className="menu-panel-empty">
                    No menu items yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editingMenu}
        onClose={handleCancel}
        title={isCreating ? 'Create New Menu' : 'Edit Menu'}
      >
        {editingMenu && (
          <>
            <FormGroup label="Menu Name" htmlFor="menu-name">
              <input
                id="menu-name"
                type="text"
                className="form-input"
                value={editingMenu.name}
                onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
                placeholder="Main Navigation"
              />
            </FormGroup>

            <FormGroup label="Handle" htmlFor="menu-handle" help="URL-friendly identifier. Auto-generated if empty.">
              <input
                id="menu-handle"
                type="text"
                className="form-input"
                value={editingMenu.handle || ''}
                onChange={(e) => setEditingMenu({ ...editingMenu, handle: e.target.value })}
                placeholder="main-navigation"
              />
            </FormGroup>

            <FormGroup label={`Menu Items (${editingMenu.items.length})`}>
              <div className="modal-item-list">
                {editingMenu.items.map((item, idx) => (
                  <div key={idx} className="modal-item-row">
                    <div className="modal-item-drag">
                      <button
                        className="modal-item-move"
                        onClick={() => idx > 0 && moveMenuItem(idx, -1)}
                        disabled={idx === 0}
                        title="Move up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        className="modal-item-move"
                        onClick={() => idx < editingMenu.items.length - 1 && moveMenuItem(idx, 1)}
                        disabled={idx === editingMenu.items.length - 1}
                        title="Move down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="modal-item-fields">
                      <input
                        type="text"
                        className="form-input"
                        value={item.label}
                        onChange={(e) => updateMenuItem(idx, 'label', e.target.value)}
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={item.url}
                        onChange={(e) => updateMenuItem(idx, 'url', e.target.value)}
                        placeholder="/path"
                      />
                    </div>
                    <button className="modal-item-remove" onClick={() => removeMenuItem(idx)} title="Remove">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="modal-add-item" onClick={addMenuItem}>
                <Plus size={14} /> Add Menu Item
              </button>
            </FormGroup>

            <div className="modal-actions">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {isCreating ? 'Create Menu' : 'Save Changes'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
