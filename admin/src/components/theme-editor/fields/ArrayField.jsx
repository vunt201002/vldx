import React, { useState } from 'react'
import FieldRenderer from './FieldRenderer'
import Modal from '../../ui/Modal'

export default function ArrayField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const [editingIndex, setEditingIndex] = useState(null)

  // Special case: array of primitives (like paragraphs)
  const isPrimitiveArray = field.fields?.length === 1 && field.fields[0].key === 'value'

  const addItem = () => {
    let newItem
    if (isPrimitiveArray) {
      newItem = ''
    } else {
      newItem = {}
      for (const f of field.fields || []) {
        newItem[f.key] = ''
      }
    }
    const newItems = [...items, newItem]
    onChange(newItems)
    setEditingIndex(newItems.length - 1)
  }

  const removeItem = (index) => {
    if (editingIndex === index) setEditingIndex(null)
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, newVal) => {
    const updated = [...items]
    updated[index] = newVal
    onChange(updated)
  }

  const updateItemField = (index, key, val) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  // Get a display label for a collapsed item
  const getItemLabel = (item, index) => {
    if (isPrimitiveArray) {
      const text = typeof item === 'string' ? item : ''
      return text ? (text.length > 50 ? text.slice(0, 50) + '…' : text) : `Item ${index + 1}`
    }
    // Try common label keys
    const labelKey = ['name', 'title', 'label', 'text', 'value', 'url']
    for (const key of labelKey) {
      if (item[key] && typeof item[key] === 'string') {
        const text = item[key]
        return text.length > 50 ? text.slice(0, 50) + '…' : text
      }
    }
    return `Item ${index + 1}`
  }

  // Find the first image in an item for thumbnail preview
  const getItemThumb = (item) => {
    if (isPrimitiveArray) return null
    for (const f of field.fields || []) {
      if (f.type === 'image' && item[f.key]) return item[f.key]
      // Check nested images array
      if (f.type === 'array' && f.fields?.length === 1 && f.fields[0].type === 'image') {
        const arr = item[f.key]
        if (Array.isArray(arr) && arr.length > 0) {
          const first = arr[0]
          return typeof first === 'string' ? first : first?.url || null
        }
      }
    }
    return null
  }

  const editingItem = editingIndex !== null ? items[editingIndex] : null

  return (
    <div className="te-field">
      <div className="te-array-field">
        <div className="te-array-field-header">
          <h4>{field.label} ({items.length})</h4>
          <button type="button" className="te-array-field-add" onClick={addItem}>
            + Add
          </button>
        </div>

        {/* Compact item list */}
        <div className="te-array-compact-list">
          {items.map((item, index) => {
            const thumb = getItemThumb(item)
            return (
              <div
                key={index}
                className={`te-array-compact-item ${editingIndex === index ? 'te-array-compact-item--active' : ''}`}
              >
                <div
                  className="te-array-compact-item-main"
                  onClick={() => setEditingIndex(index)}
                >
                  {thumb && (
                    <img src={thumb} alt="" className="te-array-compact-thumb" />
                  )}
                  <div className="te-array-compact-info">
                    <span className="te-array-compact-index">#{index + 1}</span>
                    <span className="te-array-compact-label">{getItemLabel(item, index)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="te-array-item-remove"
                  onClick={(e) => { e.stopPropagation(); removeItem(index) }}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit modal */}
      {editingIndex !== null && editingItem !== undefined && (
        <Modal
          open={true}
          onClose={() => setEditingIndex(null)}
          title={`Edit ${field.label?.replace(/s$/, '') || 'Item'} #${editingIndex + 1}`}
        >
          <div className="te-array-modal-body">
            {isPrimitiveArray ? (
              <FieldRenderer
                field={{ ...field.fields[0], key: '_value' }}
                value={editingItem}
                onChange={(val) => updateItem(editingIndex, val)}
              />
            ) : (
              (field.fields || []).map((subField) => (
                <FieldRenderer
                  key={subField.key}
                  field={subField}
                  value={editingItem[subField.key]}
                  onChange={(val) => updateItemField(editingIndex, subField.key, val)}
                />
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
