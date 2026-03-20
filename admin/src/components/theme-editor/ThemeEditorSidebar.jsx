import React from 'react'
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
  slug,
  onBack,
}) {
  return (
    <div className="te-sidebar">
      <div className="te-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', color: 'var(--color-text-muted)', padding: '0.125rem',
              }}
              title="Back to pages"
            >
              ←
            </button>
          )}
          <div>
            <h3>Sections</h3>
            {slug && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                /{slug}
              </span>
            )}
          </div>
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
