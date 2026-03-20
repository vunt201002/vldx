import React from 'react'
import FieldRenderer from './fields/FieldRenderer'

/**
 * Get a nested value from an object using a dot-separated key path.
 */
function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.')
  let current = obj
  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }
  return current
}

/**
 * Set a nested value on an object using a dot-separated key path.
 * Returns a new object (immutable).
 */
function setNestedValue(obj, keyPath, value) {
  const parts = keyPath.split('.')
  if (parts.length === 1) {
    return { ...obj, [parts[0]]: value }
  }
  const [head, ...rest] = parts
  return {
    ...obj,
    [head]: setNestedValue(obj[head] || {}, rest.join('.'), value),
  }
}

export default function BlockEditorPanel({ block, fieldDefs, onUpdateBlock, dirty, saving, onSave }) {
  if (!block) {
    return (
      <div className="te-settings-panel">
        <div className="te-settings-topbar">
          <span className="te-settings-topbar-title">Settings</span>
        </div>
        <div className="te-editor-panel">
          <div className="te-editor-empty">Select a section to edit</div>
        </div>
      </div>
    )
  }

  const typeDef = fieldDefs.find((d) => d.type === block.type)
  const fields = typeDef?.fields || []

  const handleFieldChange = (keyPath, value) => {
    const newData = setNestedValue(block.data || {}, keyPath, value)
    onUpdateBlock(block._id, { data: newData })
  }

  const handleNameChange = (value) => {
    onUpdateBlock(block._id, { name: value })
  }

  return (
    <div className="te-settings-panel">
      <div className="te-settings-topbar">
        <span className="te-settings-topbar-title">
          <span>{typeDef?.icon}</span>
          {block.name}
          <span className="te-type-badge">{block.type}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {dirty && <span className="te-dirty-dot" title="Unsaved changes" />}
          <button
            className="te-save-btn"
            onClick={onSave}
            disabled={saving || !dirty}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="te-editor-panel">
        <div className="te-field">
          <label>Section Name</label>
          <input
            type="text"
            value={block.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="te-section-divider">Content</div>

        {fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={getNestedValue(block.data || {}, field.key)}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        ))}
      </div>
    </div>
  )
}
