import React from 'react'

export default function BooleanField({ field, value, onChange }) {
  return (
    <div className="te-field">
      <label className="te-boolean-field">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    </div>
  )
}
