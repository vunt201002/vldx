import React from 'react'

export default function TextareaField({ field, value, onChange }) {
  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        rows={3}
      />
    </div>
  )
}
