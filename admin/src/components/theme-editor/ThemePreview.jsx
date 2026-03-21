import React, { useState, useRef, useCallback, useEffect } from 'react'
import buildPreviewConfig from '@/lib/buildPreviewConfig'

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3000'

const viewports = [
  { key: 'desktop', icon: '🖥', label: 'Desktop' },
  { key: 'tablet', icon: '📱', label: 'Tablet' },
  { key: 'mobile', icon: '📲', label: 'Mobile' },
]

export default function ThemePreview({ slug, activeBlockType, previewKey, page, blocks }) {
  const [viewport, setViewport] = useState('desktop')
  const iframeRef = useRef(null)
  const iframeReady = useRef(false)

  const previewUrl = `${STOREFRONT_URL}/${slug}`

  const iframeSrc = activeBlockType
    ? `${previewUrl}#${activeBlockType}`
    : previewUrl

  // Send live preview data to iframe
  const sendPreviewData = useCallback(() => {
    if (!iframeRef.current || !iframeReady.current || !page || !blocks) return
    const config = buildPreviewConfig(page, blocks)
    iframeRef.current.contentWindow.postMessage(
      { type: 'theme-preview-update', config },
      STOREFRONT_URL
    )
  }, [page, blocks])

  // Listen for iframe ready signal
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.origin !== STOREFRONT_URL) return
      if (e.data?.type === 'theme-preview-ready') {
        iframeReady.current = true
        sendPreviewData()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [sendPreviewData])

  // Send preview data whenever page or blocks change
  useEffect(() => {
    sendPreviewData()
  }, [sendPreviewData])

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      iframeReady.current = false
      iframeRef.current.src = iframeRef.current.src
    }
  }, [])

  const handleIframeLoad = useCallback(() => {
    // Give iframe a moment to set up listener, then send
    setTimeout(() => {
      iframeReady.current = true
      sendPreviewData()
    }, 500)
  }, [sendPreviewData])

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
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  )
}
