import React, { useState, useEffect } from 'react'
import { get, post, put, del } from '@/lib/api'

const styles = {
  container: {
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  addBtn: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  menuCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    padding: '1.25rem',
    transition: 'box-shadow 0.15s',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  menuName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '0.25rem',
  },
  menuHandle: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    fontFamily: 'monospace',
  },
  menuActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.4rem',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '6px',
    transition: 'background-color 0.15s',
  },
  menuItems: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 0.8rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
  },
  menuItemLabel: {
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  menuItemUrl: {
    color: 'var(--color-text-muted)',
    fontSize: '0.75rem',
    marginLeft: '0.5rem',
  },
  emptyState: {
    padding: '3rem 1rem',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  itemRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    alignItems: 'flex-start',
  },
  dragHandle: {
    cursor: 'grab',
    padding: '0.6rem 0.4rem',
    color: 'var(--color-text-muted)',
    fontSize: '1.2rem',
  },
  removeBtn: {
    backgroundColor: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 0.8rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  addItemBtn: {
    backgroundColor: '#f8fafc',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    padding: '0.6rem 1rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    width: '100%',
    marginTop: '0.5rem',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  btnPrimary: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
}

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Menus ({menus.length})</h1>
        <button
          style={styles.addBtn}
          onClick={handleCreate}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-primary)')}
        >
          + Create Menu
        </button>
      </div>

      {menus.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            No menus yet
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Create your first menu to get started
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {menus.map((menu) => (
            <div
              key={menu._id}
              style={styles.menuCard}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
            >
              <div style={styles.menuHeader}>
                <div>
                  <div style={styles.menuName}>{menu.name}</div>
                  <div style={styles.menuHandle}>{menu.handle}</div>
                </div>
                <div style={styles.menuActions}>
                  <button
                    style={styles.iconBtn}
                    onClick={() => handleEdit(menu)}
                    title="Edit menu"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => handleDelete(menu._id)}
                    title="Delete menu"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#fee')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <ul style={styles.menuItems}>
                {menu.items.map((item, idx) => (
                  <li key={idx} style={styles.menuItem}>
                    <span>
                      <span style={styles.menuItemLabel}>{item.label}</span>
                      <span style={styles.menuItemUrl}>{item.url}</span>
                    </span>
                  </li>
                ))}
                {menu.items.length === 0 && (
                  <li style={{ ...styles.menuItem, fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                    No items
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {editingMenu && (
        <div style={styles.modal} onClick={handleCancel}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>
              {isCreating ? 'Create New Menu' : 'Edit Menu'}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Menu Name</label>
              <input
                type="text"
                style={styles.input}
                value={editingMenu.name}
                onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
                placeholder="Main Navigation"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Handle (optional)</label>
              <input
                type="text"
                style={styles.input}
                value={editingMenu.handle || ''}
                onChange={(e) => setEditingMenu({ ...editingMenu, handle: e.target.value })}
                placeholder="main-navigation (auto-generated if empty)"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Menu Items</label>
              <ul style={styles.itemsList}>
                {editingMenu.items.map((item, idx) => (
                  <li key={idx} style={styles.itemRow}>
                    <span
                      style={styles.dragHandle}
                      onClick={() => idx > 0 && moveMenuItem(idx, -1)}
                      title="Move up"
                    >
                      ⬆️
                    </span>
                    <span
                      style={styles.dragHandle}
                      onClick={() => idx < editingMenu.items.length - 1 && moveMenuItem(idx, 1)}
                      title="Move down"
                    >
                      ⬇️
                    </span>
                    <input
                      type="text"
                      style={{ ...styles.input, flex: 1 }}
                      value={item.label}
                      onChange={(e) => updateMenuItem(idx, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      style={{ ...styles.input, flex: 1 }}
                      value={item.url}
                      onChange={(e) => updateMenuItem(idx, 'url', e.target.value)}
                      placeholder="/path"
                    />
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeMenuItem(idx)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button style={styles.addItemBtn} onClick={addMenuItem}>
                + Add Item
              </button>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={handleCancel}>
                Cancel
              </button>
              <button
                style={styles.btnPrimary}
                onClick={handleSave}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-primary-hover)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-primary)')}
              >
                {isCreating ? 'Create Menu' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
