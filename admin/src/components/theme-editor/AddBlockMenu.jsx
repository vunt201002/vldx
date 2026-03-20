import React, { useState, useRef, useEffect } from 'react'

export default function AddBlockMenu({ fieldDefs, onAdd }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleAdd = (type) => {
    onAdd(type)
    setOpen(false)
  }

  return (
    <div className="te-add-block-wrapper" ref={menuRef}>
      {open && (
        <div className="te-add-menu">
          {fieldDefs.map((def) => (
            <button
              key={def.type}
              className="te-add-menu-item"
              onClick={() => handleAdd(def.type)}
            >
              <span>{def.icon}</span>
              <span>{def.label}</span>
            </button>
          ))}
        </div>
      )}
      <button className="te-add-block-btn" onClick={() => setOpen(!open)}>
        + Add Section
      </button>
    </div>
  )
}
