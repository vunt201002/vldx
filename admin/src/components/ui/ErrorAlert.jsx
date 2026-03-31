import React from 'react'
import { X } from 'lucide-react'

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-alert">
      <span>{message}</span>
      {onDismiss && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={14} strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}
