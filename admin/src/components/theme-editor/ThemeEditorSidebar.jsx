import React, { useState } from 'react'
import BlockList from './BlockList'
import AddBlockMenu from './AddBlockMenu'
import PageSettingsPanel from './PageSettingsPanel'

export default function ThemeEditorSidebar({
  page,
  blocks,
  fieldDefs,
  activeBlockId,
  onSelectBlock,
  onReorder,
  onDeleteBlock,
  onAddBlock,
  onUpdatePage,
  pages,
  currentSlug,
  onPageSwitch,
  onCreatePage,
  onDeletePage,
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newSlug.trim() || !newTitle.trim()) return
    setCreating(true)
    await onCreatePage(newSlug.trim().toLowerCase(), newTitle.trim())
    setNewSlug('')
    setNewTitle('')
    setShowCreate(false)
    setCreating(false)
  }

  return (
    <div className="te-sidebar">
      {/* Page selector + create */}
      <div className="te-page-selector">
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <select
            value={currentSlug || ''}
            onChange={(e) => onPageSwitch(e.target.value)}
            style={{ flex: 1 }}
          >
            {(pages || []).map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            className="te-page-action-btn"
            onClick={() => setShowCreate(!showCreate)}
            title="Create new page"
          >
            +
          </button>
          {currentSlug && currentSlug !== 'landing' && (
            <button
              className="te-page-action-btn te-page-delete-btn"
              onClick={() => onDeletePage(currentSlug)}
              title="Delete this page"
            >
              ×
            </button>
          )}
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="te-create-page-form">
            <input
              type="text"
              placeholder="slug (e.g. services)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              required
            />
            <input
              type="text"
              placeholder="Page Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button type="submit" className="te-create-page-submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button type="button" className="te-create-page-cancel" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="te-sidebar-header">
        <div>
          <h3>Sections</h3>
          {currentSlug && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              /{currentSlug}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {blocks.length} blocks
        </span>
      </div>
      <PageSettingsPanel page={page} onChange={onUpdatePage} />
      <div className="te-sidebar-body">
        <BlockList
          blocks={blocks}
          fieldDefs={fieldDefs}
          activeBlockId={activeBlockId}
          onSelect={onSelectBlock}
          onReorder={onReorder}
          onDelete={onDeleteBlock}
        />
      </div>
      <AddBlockMenu fieldDefs={fieldDefs} onAdd={onAddBlock} />
    </div>
  )
}
