import React, { useState } from 'react'
import BlockList from './BlockList'
import AddBlockMenu from './AddBlockMenu'
import CopyBlockModal from './CopyBlockModal'
import PageSettingsPanel from './PageSettingsPanel'

export default function ThemeEditorSidebar({
  page,
  headerBlocks = [],
  bodyBlocks = [],
  footerBlocks = [],
  fieldDefs,
  activeBlockId,
  activeSection,
  onSelectBlock,
  onReorder,
  onDeleteBlock,
  onAddBlock,
  onCloneBlock,
  onUpdatePage,
  pages,
  currentSlug,
  onPageSwitch,
  onCreatePage,
  onDeletePage,
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
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
          {headerBlocks.length + bodyBlocks.length + footerBlocks.length} blocks
        </span>
      </div>
      <PageSettingsPanel page={page} onChange={onUpdatePage} />
      <div className="te-sidebar-body">
        {/* Header Section (Global) */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fef3c7',
            borderLeft: '3px solid #f59e0b',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>
              🔒 HEADER (Global)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#92400e' }}>
              {headerBlocks.length}
            </span>
          </div>
          <BlockList
            blocks={headerBlocks}
            fieldDefs={fieldDefs}
            activeBlockId={activeBlockId}
            onSelect={(id) => onSelectBlock(id, 'header')}
            onReorder={(from, to) => onReorder(from, to, 'header')}
            onDelete={(id) => onDeleteBlock(id, 'header')}
          />
          <div style={{ padding: '0.5rem 1rem' }}>
            <AddBlockMenu
              fieldDefs={fieldDefs}
              onAdd={(type) => onAddBlock(type, 'header')}
              buttonLabel="+ Add to Header"
            />
          </div>
        </div>

        {/* Body Section (Page-specific) */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#dcfce7',
            borderLeft: '3px solid #22c55e',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>
              📄 BODY (This Page)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#166534' }}>
              {bodyBlocks.length}
            </span>
          </div>
          <BlockList
            blocks={bodyBlocks}
            fieldDefs={fieldDefs}
            activeBlockId={activeBlockId}
            onSelect={(id) => onSelectBlock(id, 'body')}
            onReorder={(from, to) => onReorder(from, to, 'body')}
            onDelete={(id) => onDeleteBlock(id, 'body')}
          />
          <div style={{ padding: '0.5rem 1rem' }}>
            <AddBlockMenu
              fieldDefs={fieldDefs}
              onAdd={(type) => onAddBlock(type, 'body')}
              buttonLabel="+ Add to Body"
            />
          </div>
        </div>

        {/* Footer Section (Global) */}
        <div>
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fef3c7',
            borderLeft: '3px solid #f59e0b',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>
              🔒 FOOTER (Global)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#92400e' }}>
              {footerBlocks.length}
            </span>
          </div>
          <BlockList
            blocks={footerBlocks}
            fieldDefs={fieldDefs}
            activeBlockId={activeBlockId}
            onSelect={(id) => onSelectBlock(id, 'footer')}
            onReorder={(from, to) => onReorder(from, to, 'footer')}
            onDelete={(id) => onDeleteBlock(id, 'footer')}
          />
          <div style={{ padding: '0.5rem 1rem 1rem' }}>
            <AddBlockMenu
              fieldDefs={fieldDefs}
              onAdd={(type) => onAddBlock(type, 'footer')}
              buttonLabel="+ Add to Footer"
            />
          </div>
        </div>
      </div>
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)' }}>
        <button className="te-copy-block-btn" onClick={() => setShowCopyModal(true)} title="Copy block from another page" style={{ width: '100%' }}>
          Copy from page
        </button>
      </div>

      {showCopyModal && (
        <CopyBlockModal
          pages={pages}
          currentSlug={currentSlug}
          fieldDefs={fieldDefs}
          onClone={onCloneBlock}
          onClose={() => setShowCopyModal(false)}
        />
      )}
    </div>
  )
}
