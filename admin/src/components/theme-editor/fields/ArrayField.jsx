import React, { useState } from 'react'
import FieldRenderer from './FieldRenderer'

export default function ArrayField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const [editingIndex, setEditingIndex] = useState(null)

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
        {items.map((item, index) => {
          const preview = isPrimitiveArray
            ? (item || '').toString().slice(0, 40)
            : Object.values(item || {}).filter(v => typeof v === 'string' && v).map(v => v.length > 30 ? v.slice(0, 30) + '…' : v)[0] || ''

          return (
            <div
              key={index}
              className="te-array-item te-array-item--compact"
              onClick={() => setEditingIndex(index)}
            >
              <span className="te-array-item-label">#{index + 1}</span>
              {preview && <span className="te-array-item-preview">{preview}</span>}
              <button
                type="button"
                className="te-array-item-remove"
                onClick={(e) => { e.stopPropagation(); removeItem(index); }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal for editing item */}
      {editingIndex !== null && editingItem !== undefined && (
        <div className="te-modal-overlay" onClick={() => setEditingIndex(null)}>
          <div className="te-modal" onClick={(e) => e.stopPropagation()}>
            <div className="te-modal-header">
              <h4>#{editingIndex + 1} — {field.label}</h4>
              <button type="button" className="te-modal-close" onClick={() => setEditingIndex(null)}>
                ✕
              </button>
            </div>
            <div className="te-modal-body">
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
            <div className="te-modal-footer">
              <button type="button" className="te-modal-done" onClick={() => setEditingIndex(null)}>
                Done
              </button>
            </div>
          </div>

          <style>{`
            .te-modal-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.45);
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .te-modal {
              background: #fff;
              border-radius: 8px;
              width: 100%;
              max-width: 520px;
              max-height: 85vh;
              display: flex;
              flex-direction: column;
              box-shadow: 0 20px 60px rgba(0,0,0,0.25);
            }
            .te-modal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 16px 20px;
              border-bottom: 1px solid #e5e7eb;
            }
            .te-modal-header h4 {
              margin: 0;
              font-size: 15px;
              font-weight: 600;
              color: #111;
            }
            .te-modal-close {
              background: none;
              border: none;
              font-size: 18px;
              cursor: pointer;
              color: #999;
              padding: 4px 8px;
              border-radius: 4px;
            }
            .te-modal-close:hover {
              background: #f3f4f6;
              color: #333;
            }
            .te-modal-body {
              padding: 20px;
              overflow-y: auto;
              flex: 1;
            }
            .te-modal-footer {
              padding: 12px 20px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: flex-end;
            }
            .te-modal-done {
              background: #4f46e5;
              color: #fff;
              border: none;
              padding: 8px 24px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
            }
            .te-modal-done:hover {
              background: #4338ca;
            }
            .te-array-item--compact {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              cursor: pointer;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              margin-bottom: 4px;
              transition: background 0.15s;
            }
            .te-array-item--compact:hover {
              background: #f9fafb;
            }
            .te-array-item--compact .te-array-item-label {
              font-size: 13px;
              font-weight: 600;
              color: #374151;
              flex-shrink: 0;
            }
            .te-array-item--compact .te-array-item-preview {
              font-size: 12px;
              color: #9ca3af;
              flex: 1;
              min-width: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .te-array-item--compact .te-array-item-remove {
              background: none;
              border: none;
              color: #d1d5db;
              font-size: 14px;
              cursor: pointer;
              padding: 2px 4px;
              flex-shrink: 0;
              line-height: 1;
            }
            .te-array-item--compact .te-array-item-remove:hover {
              color: #ef4444;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
