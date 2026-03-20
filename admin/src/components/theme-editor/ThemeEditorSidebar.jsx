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
}) {
  return (
    <div className="te-sidebar">
      <div className="te-sidebar-header">
        <h3>Sections</h3>
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
