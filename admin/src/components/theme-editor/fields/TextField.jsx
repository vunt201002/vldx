import React from 'react'

export default function TextField({ field, value, onChange }) {
  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
      />
    </div>
  )
}
