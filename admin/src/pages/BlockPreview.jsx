import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getMockDataForBlock } from '@/config/blockMockData'
import BlockRenderer from '@/components/BlockRenderer'
import '@/styles/theme-editor.css'

// Recursively render form fields for settings object
function SettingsEditor({ settings, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div>
      {Object.entries(settings).map(([key, value]) => {
        const fieldType = typeof value

        if (fieldType === 'string') {
          // Check if it's a URL or a long text
          if (key.includes('Url') || key.includes('Image') || key.includes('image')) {
            return (
              <div key={key} className="te-field">
                <label>{formatLabel(key)}</label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                />
              </div>
            )
          } else if (value.length > 50 || key === 'description' || key === 'desc') {
            return (
              <div key={key} className="te-field">
                <label>{formatLabel(key)}</label>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                />
              </div>
            )
          } else {
            return (
              <div key={key} className="te-field">
                <label>{formatLabel(key)}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                />
              </div>
            )
          }
        } else if (fieldType === 'number') {
          return (
            <div key={key} className="te-field">
              <label>{formatLabel(key)}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
              />
            </div>
          )
        } else if (fieldType === 'boolean') {
          return (
            <div key={key} className="te-field">
              <div className="te-boolean-field">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
                <span>{formatLabel(key)}</span>
              </div>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

// Format field key to readable label
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// Nested block editor
function NestedBlocksEditor({ blocks, onChange }) {
  const handleBlockChange = (index, updates) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], settings: { ...newBlocks[index].settings, ...updates } }
    onChange(newBlocks)
  }

  const handleRemoveBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    onChange(newBlocks)
  }

  const handleAddBlock = () => {
    const newBlock = { type: 'new-block', settings: {} }
    onChange([...blocks, newBlock])
  }

  return (
    <div className="te-array-field">
      <div className="te-array-field-header">
        <h4>Nested Blocks</h4>
        <button className="te-array-field-add" onClick={handleAddBlock}>
          + Add
        </button>
      </div>
      {blocks.map((block, index) => (
        <div key={index} className="te-array-item">
          <div className="te-array-item-header">
            <span>
              Block {index + 1}: {block.type}
            </span>
            <button className="te-array-item-remove" onClick={() => handleRemoveBlock(index)}>
              Remove
            </button>
          </div>
          <SettingsEditor
            settings={block.settings || {}}
            onChange={(newSettings) => handleBlockChange(index, newSettings)}
          />
        </div>
      ))}
      {blocks.length === 0 && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>
          No nested blocks
        </div>
      )}
    </div>
  )
}

export default function BlockPreview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const blockType = searchParams.get('type')

  const [blockData, setBlockData] = useState(null)
  const [settings, setSettings] = useState({})
  const [nestedBlocks, setNestedBlocks] = useState([])

  useEffect(() => {
    if (!blockType) {
      navigate('/blocks')
      return
    }

    const mockData = getMockDataForBlock(blockType)
    setBlockData(mockData)
    setSettings(mockData.settings || {})
    setNestedBlocks(mockData.blocks || [])
  }, [blockType, navigate])

  if (!blockType || !blockData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading block preview...
      </div>
    )
  }

  const previewData = {
    type: blockType,
    settings,
    blocks: nestedBlocks,
  }

  return (
    <div className="theme-editor">
      {/* Left Panel: Settings Editor */}
      <div className="te-settings-panel" style={{ width: '420px', minWidth: '420px' }}>
        <div className="te-settings-topbar">
          <div className="te-settings-topbar-title">
            <button
              onClick={() => navigate('/blocks')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: 'var(--color-text-muted)',
                marginRight: '0.5rem',
                padding: '0.25rem',
              }}
            >
              ←
            </button>
            Block Settings
            <span className="te-type-badge">{blockType}</span>
          </div>
        </div>

        <div className="te-editor-panel">
          <div className="te-editor-header">
            <h2>Preview Mode</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Adjust settings below to see how the block renders with different configurations. Changes are not saved.
            </p>
          </div>

          <div className="te-section-divider">Block Settings</div>
          <SettingsEditor settings={settings} onChange={setSettings} />

          {nestedBlocks.length > 0 && (
            <>
              <div className="te-section-divider" style={{ marginTop: '1.5rem' }}>
                Nested Blocks
              </div>
              <NestedBlocksEditor blocks={nestedBlocks} onChange={setNestedBlocks} />
            </>
          )}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="te-preview">
        <div className="te-preview-toolbar">
          <div className="te-preview-toolbar-left">
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Live Preview
            </span>
          </div>
          <div className="te-preview-toolbar-right">
            <button
              className="te-refresh-btn"
              onClick={() => {
                const mockData = getMockDataForBlock(blockType)
                setSettings(mockData.settings || {})
                setNestedBlocks(mockData.blocks || [])
              }}
              title="Reset to default"
            >
              ↻ Reset
            </button>
          </div>
        </div>

        <div className="te-preview-frame-wrapper" style={{ alignItems: 'flex-start', padding: 0 }}>
          <div
            style={{
              width: '100%',
              backgroundColor: 'white',
              minHeight: '100%',
              overflow: 'auto',
            }}
          >
            <BlockRenderer type={blockType} settings={settings} blocks={nestedBlocks} />
          </div>
        </div>
      </div>
    </div>
  )
}
