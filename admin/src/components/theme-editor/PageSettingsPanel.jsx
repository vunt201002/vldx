import React, { useState } from 'react'

const FONT_OPTIONS = [
  { label: '-- Default --', value: '' },
  { label: 'Cormorant (Serif)', value: 'Cormorant' },
  { label: 'Playfair Display (Serif)', value: 'Playfair Display' },
  { label: 'Lora (Serif)', value: 'Lora' },
  { label: 'DM Serif Display (Serif)', value: 'DM Serif Display' },
  { label: 'Merriweather (Serif)', value: 'Merriweather' },
  { label: 'Outfit (Sans)', value: 'Outfit' },
  { label: 'Inter (Sans)', value: 'Inter' },
  { label: 'Poppins (Sans)', value: 'Poppins' },
  { label: 'Montserrat (Sans)', value: 'Montserrat' },
  { label: 'Raleway (Sans)', value: 'Raleway' },
  { label: 'DM Sans (Sans)', value: 'DM Sans' },
  { label: 'Nunito (Sans)', value: 'Nunito' },
  { label: 'Work Sans (Sans)', value: 'Work Sans' },
  { label: 'Josefin Sans (Sans)', value: 'Josefin Sans' },
  { label: 'Space Grotesk (Sans)', value: 'Space Grotesk' },
]

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
          <div className="te-field">
            <label>Display Font (headings)</label>
            <select
              value={page.displayFont || ''}
              onChange={(e) => update('displayFont', e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="te-field">
            <label>Body Font (text)</label>
            <select
              value={page.bodyFont || ''}
              onChange={(e) => update('bodyFont', e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
