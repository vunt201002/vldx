import React from 'react'

export default function SelectField({ field, value, onChange }) {
  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- Select --</option>
        {(field.options || []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
