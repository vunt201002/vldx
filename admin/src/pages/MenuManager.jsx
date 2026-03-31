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
    setEditingMenu({
      name: '',
      handle: '',
      items: [],
    })
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
    // Reorder remaining items
    newItems.forEach((item, i) => {
      item.order = i
    })
    setEditingMenu({ ...editingMenu, items: newItems })
  }

  const moveMenuItem = (index, direction) => {
    const newItems = [...editingMenu.items]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= newItems.length) return

    // Swap items
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    // Update order
    newItems.forEach((item, i) => {
      item.order = i
    })
    setEditingMenu({ ...editingMenu, items: newItems })
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading menus...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <PageHeader title={`Menus (${menus.length})`}>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Create Menu
        </Button>
      </PageHeader>

      {menus.length === 0 ? (
        <EmptyState
          icon={Menu}
          title="No menus yet"
          description="Create your first menu to get started"
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {menus.map((menu) => (
            <Card key={menu._id} className="menu-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {menu.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {menu.handle}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => handleEdit(menu)}
                    title="Edit menu"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(menu._id)}
                    title="Delete menu"
                  />
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {menu.items.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      marginBottom: '0.5rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color: 'var(--color-text-muted)',
                          fontSize: '0.75rem',
                          marginLeft: '0.5rem',
                        }}
                      >
                        {item.url}
                      </span>
                    </span>
                  </li>
                ))}
                {menu.items.length === 0 && (
                  <li
                    style={{
                      padding: '0.6rem 0.8rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    No items
                  </li>
                )}
              </ul>
            </Card>
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
                onChange={(e) =>
                  setEditingMenu({ ...editingMenu, name: e.target.value })
                }
                placeholder="Main Navigation"
              />
            </FormGroup>

            <FormGroup label="Handle (optional)" htmlFor="menu-handle">
              <input
                id="menu-handle"
                type="text"
                className="form-input"
                value={editingMenu.handle || ''}
                onChange={(e) =>
                  setEditingMenu({ ...editingMenu, handle: e.target.value })
                }
                placeholder="main-navigation (auto-generated if empty)"
              />
            </FormGroup>

            <FormGroup label="Menu Items">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {editingMenu.items.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ChevronUp}
                      onClick={() => idx > 0 && moveMenuItem(idx, -1)}
                      title="Move up"
                      disabled={idx === 0}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ChevronDown}
                      onClick={() =>
                        idx < editingMenu.items.length - 1 &&
                        moveMenuItem(idx, 1)
                      }
                      title="Move down"
                      disabled={idx === editingMenu.items.length - 1}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={item.label}
                      onChange={(e) =>
                        updateMenuItem(idx, 'label', e.target.value)
                      }
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={item.url}
                      onChange={(e) =>
                        updateMenuItem(idx, 'url', e.target.value)
                      }
                      placeholder="/path"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={X}
                      onClick={() => removeMenuItem(idx)}
                      title="Remove item"
                    />
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                icon={Plus}
                onClick={addMenuItem}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Add Item
              </Button>
            </FormGroup>

            <div className="modal-actions">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
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
