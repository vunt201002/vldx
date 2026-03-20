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
  pages,
  currentSlug,
  onPageSwitch,
}) {
  return (
    <div className="te-sidebar">
      {/* Page selector */}
      {pages && pages.length > 1 && (
        <div className="te-page-selector">
          <select
            value={currentSlug || ''}
            onChange={(e) => onPageSwitch(e.target.value)}
          >
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

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
