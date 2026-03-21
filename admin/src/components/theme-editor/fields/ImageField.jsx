import React, { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ImageField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', field.uploadFolder || 'general')

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        throw new Error(err.message || 'Upload failed')
      }

      const data = await res.json()
      onChange(data.data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="te-field">
      <label>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>

      {/* Preview */}
      {value && (
        <div style={{
          marginBottom: '0.5rem',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#f0f0f0',
        }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.375rem' }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '0.375rem 0.75rem',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? 'Uploading...' : value ? 'Replace Image' : 'Upload Image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              padding: '0.375rem 0.625rem',
              background: 'none',
              color: 'var(--color-danger)',
              border: '1px solid var(--color-danger)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      {/* URL input fallback */}
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'Or paste image URL'}
      />

      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
    </div>
  )
}
