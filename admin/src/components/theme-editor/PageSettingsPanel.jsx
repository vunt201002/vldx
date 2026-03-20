import React, { useState } from 'react'

export default function PageSettingsPanel({ page, onChange }) {
  const [expanded, setExpanded] = useState(false)

  const update = (key, value) => {
    onChange({ ...page, [key]: value })
  }

  return (
    <div className="te-page-settings">
      <button
        className="te-page-settings-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Page Settings</span>
        <span>{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <div className="te-page-settings-body">
          <div className="te-field">
            <label>Title</label>
            <input
              type="text"
              value={page.title || ''}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>
          <div className="te-field">
            <label>Description</label>
            <textarea
              value={page.description || ''}
              onChange={(e) => update('description', e.target.value)}
              rows={2}
            />
          </div>
          <div className="te-field">
            <label>Body Class</label>
            <input
              type="text"
              value={page.bodyClass || ''}
              onChange={(e) => update('bodyClass', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
