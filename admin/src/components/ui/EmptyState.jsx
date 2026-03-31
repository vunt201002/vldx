import React from 'react'

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={48} strokeWidth={1.25} />
        </div>
      )}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
    </div>
  )
}
