import React from 'react'

export default function NumberField({ field, value, onChange }) {
  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={field.placeholder || ''}
      />
    </div>
  )
}
