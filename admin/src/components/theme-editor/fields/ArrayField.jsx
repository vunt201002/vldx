import React from 'react'
import FieldRenderer from './FieldRenderer'

export default function ArrayField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []

  // Special case: array of primitives (like paragraphs)
  // Detected when there's exactly one sub-field with key "value"
  const isPrimitiveArray = field.fields?.length === 1 && field.fields[0].key === 'value'

  const addItem = () => {
    if (isPrimitiveArray) {
      onChange([...items, ''])
    } else {
      const empty = {}
      for (const f of field.fields || []) {
        empty[f.key] = ''
      }
      onChange([...items, empty])
    }
  }

  const removeItem = (index) => {
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

  return (
    <div className="te-field">
      <div className="te-array-field">
        <div className="te-array-field-header">
          <h4>{field.label} ({items.length})</h4>
          <button type="button" className="te-array-field-add" onClick={addItem}>
            + Add
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="te-array-item">
            <div className="te-array-item-header">
              <span>#{index + 1}</span>
              <button
                type="button"
                className="te-array-item-remove"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
            {isPrimitiveArray ? (
              <FieldRenderer
                field={{ ...field.fields[0], key: '_value' }}
                value={item}
                onChange={(val) => updateItem(index, val)}
              />
            ) : (
              (field.fields || []).map((subField) => (
                <FieldRenderer
                  key={subField.key}
                  field={subField}
                  value={item[subField.key]}
                  onChange={(val) => updateItemField(index, subField.key, val)}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
