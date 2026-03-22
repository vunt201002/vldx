import React, { useState, useEffect } from 'react'
import { get } from '@/lib/api'

export default function CopyBlockModal({ pages, currentSlug, fieldDefs, onClone, onClose }) {
  const [selectedPage, setSelectedPage] = useState('')
  const [pageBlocks, setPageBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [cloning, setCloning] = useState(null)

  const otherPages = (pages || []).filter((p) => p.slug !== currentSlug)

  useEffect(() => {
    if (!selectedPage) {
      setPageBlocks([])
      return
    }
    setLoading(true)
    get(`/theme/pages/${selectedPage}`)
      .then((res) => setPageBlocks(res.data.blocks || []))
      .catch(() => setPageBlocks([]))
      .finally(() => setLoading(false))
  }, [selectedPage])

  const getTypeDef = (type) => fieldDefs.find((d) => d.type === type)

  const handleClone = async (block) => {
    setCloning(block._id)
    await onClone(block._id)
    setCloning(null)
    onClose()
  }

  return (
    <div className="cb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cb-modal">
        <div className="cb-header">
          <h3>Copy block from another page</h3>
          <button className="cb-close" onClick={onClose}>&times;</button>
        </div>

        <div className="cb-body">
          {otherPages.length === 0 ? (
            <p className="cb-empty">No other pages available.</p>
          ) : (
            <>
              <label className="cb-label">Select source page</label>
              <div className="cb-page-pills">
                {otherPages.map((p) => (
                  <button
                    key={p.slug}
                    className={`cb-pill ${selectedPage === p.slug ? 'active' : ''}`}
                    onClick={() => setSelectedPage(p.slug)}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              {selectedPage && (
                <div className="cb-blocks-list">
                  {loading ? (
                    <p className="cb-loading">Loading blocks...</p>
                  ) : pageBlocks.length === 0 ? (
                    <p className="cb-empty">No blocks on this page.</p>
                  ) : (
                    pageBlocks.map((block) => {
                      const typeDef = getTypeDef(block.type)
                      return (
                        <div key={block._id} className="cb-block-item">
                          <div className="cb-block-info">
                            <span className="cb-block-icon">{typeDef?.icon || '?'}</span>
                            <div>
                              <div className="cb-block-name">{block.name}</div>
                              <div className="cb-block-type">{typeDef?.label || block.type}</div>
                            </div>
                          </div>
                          <button
                            className="cb-copy-btn"
                            onClick={() => handleClone(block)}
                            disabled={cloning === block._id}
                          >
                            {cloning === block._id ? 'Copying...' : 'Copy'}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
