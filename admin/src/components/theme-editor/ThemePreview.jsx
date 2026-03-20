import React, { useState, useRef, useCallback } from 'react'

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3000'

const viewports = [
  { key: 'desktop', icon: '🖥', label: 'Desktop' },
  { key: 'tablet', icon: '📱', label: 'Tablet' },
  { key: 'mobile', icon: '📲', label: 'Mobile' },
]

export default function ThemePreview({ slug, activeBlockType, previewKey }) {
  const [viewport, setViewport] = useState('desktop')
  const iframeRef = useRef(null)

  const previewUrl = `${STOREFRONT_URL}/${slug}`

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }, [])

  const iframeSrc = activeBlockType
    ? `${previewUrl}#${activeBlockType}`
    : previewUrl

  return (
    <div className="te-preview">
      <div className="te-preview-toolbar">
        <div className="te-preview-toolbar-left">
          <span className="te-preview-url">{previewUrl}</span>
          <button
            className="te-refresh-btn"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            ↻
          </button>
        </div>
        <div className="te-preview-toolbar-right">
          <div className="te-viewport-btns">
            {viewports.map((vp) => (
              <button
                key={vp.key}
                className={`te-viewport-btn${viewport === vp.key ? ' active' : ''}`}
                onClick={() => setViewport(vp.key)}
                title={vp.label}
              >
                {vp.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="te-preview-frame-wrapper">
        <iframe
          ref={iframeRef}
          key={previewKey}
          src={iframeSrc}
          className={`te-preview-iframe ${viewport}`}
          title="Storefront Preview"
        />
      </div>
    </div>
  )
}
