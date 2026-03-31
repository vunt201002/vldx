import React from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
