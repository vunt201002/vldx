import React, { useState, useEffect } from 'react'
import { get } from '@/lib/api'

export default function MenuSelectField({ field, value, onChange }) {
  const [menus, setMenus] = useState([])

  useEffect(() => {
    get('/menus').then((res) => {
      setMenus(res.data || [])
    }).catch(() => {})
  }, [])

  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- No menu (manual links) --</option>
        {menus.map((menu) => (
          <option key={menu._id} value={menu.handle}>
            {menu.name} ({menu.items?.length || 0} items)
          </option>
        ))}
      </select>
    </div>
  )
}
