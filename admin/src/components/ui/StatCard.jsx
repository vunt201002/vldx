import React from 'react'

export default function StatCard({ icon: Icon, value, label, color }) {
  const colorClass = color ? 'stat-card-icon--' + color : ''
  return (
    <div className="stat-card">
      <div className={'stat-card-icon ' + colorClass}>
        {Icon && <Icon size={22} strokeWidth={1.75} />}
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  )
}
