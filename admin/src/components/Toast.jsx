import React, { useEffect } from 'react'

const toastStyles = {
  container: {
    position: 'fixed',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#fff',
    zIndex: 9999,
    animation: 'toast-slide-in 0.25s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxWidth: '90vw',
  },
  success: { backgroundColor: '#16a34a' },
  error: { backgroundColor: '#dc2626' },
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('toast-keyframes')) {
  const style = document.createElement('style')
  style.id = 'toast-keyframes'
  style.textContent = `
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(-50%) translateY(0.5rem); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `
  document.head.appendChild(style)
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!message) return null

  return (
    <div style={{ ...toastStyles.container, ...toastStyles[type] }}>
      {type === 'success' ? '✓ ' : '✕ '}{message}
    </div>
  )
}
