import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, del } from '@/lib/api'

export default function PageList() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const loadPages = async () => {
    try {
      const res = await get('/theme/pages')
      setPages(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPages() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newSlug.trim() || !newTitle.trim()) return
    try {
      await post('/theme/pages', { slug: newSlug.trim().toLowerCase(), title: newTitle.trim() })
      setNewSlug('')
      setNewTitle('')
      setShowCreate(false)
      loadPages()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (slug) => {
    if (!window.confirm(`Delete page "${slug}"? This removes all its blocks.`)) return
    try {
      await del(`/theme/pages/${slug}`)
      loadPages()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div style={styles.center}>Loading pages...</div>

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Pages</h2>
          <p style={styles.subtitle}>Select a page to edit its theme, or create a new one.</p>
        </div>
        <button style={styles.createBtn} onClick={() => setShowCreate(!showCreate)}>
          + New Page
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showCreate && (
        <form onSubmit={handleCreate} style={styles.createForm}>
          <input
            style={styles.input}
            type="text"
            placeholder="slug (e.g. about)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Page Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <button style={styles.submitBtn} type="submit">Create</button>
          <button style={styles.cancelBtn} type="button" onClick={() => setShowCreate(false)}>Cancel</button>
        </form>
      )}

      <div style={styles.grid}>
        {pages.map((page) => (
          <div key={page.slug} style={styles.card}>
            <div style={styles.cardBody} onClick={() => navigate(`/theme-editor/${page.slug}`)}>
              <div style={styles.cardSlug}>/{page.slug}</div>
              <h3 style={styles.cardTitle}>{page.title}</h3>
              <div style={styles.cardMeta}>
                <span>{page.blockCount} sections</span>
                <span style={{
                  ...styles.badge,
                  background: page.isPublished ? '#dcfce7' : '#fef3c7',
                  color: page.isPublished ? '#166534' : '#92400e',
                }}>
                  {page.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div style={styles.cardActions}>
              <button
                style={styles.editBtn}
                onClick={() => navigate(`/theme-editor/${page.slug}`)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(page.slug)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div style={styles.empty}>
            No pages yet. Click "+ New Page" to create one.
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  center: { display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-muted)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' },
  subtitle: { fontSize: '0.875rem', color: 'var(--color-text-muted)' },
  createBtn: {
    padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white',
    border: 'none', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
  },
  createForm: {
    display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem',
    padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
  },
  input: {
    padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px',
    fontSize: '0.875rem', flex: 1,
  },
  submitBtn: {
    padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.5rem 1rem', background: 'none', color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer',
  },
  error: {
    padding: '0.75rem 1rem', background: '#fef2f2', color: 'var(--color-danger)',
    borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  card: {
    background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)',
    overflow: 'hidden', transition: 'box-shadow 0.15s',
  },
  cardBody: { padding: '1.25rem', cursor: 'pointer' },
  cardSlug: { fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginBottom: '0.375rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)' },
  badge: { padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 },
  cardActions: {
    display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem',
    borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)',
  },
  editBtn: {
    flex: 1, padding: '0.375rem', background: 'var(--color-primary)', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '0.8125rem', cursor: 'pointer',
  },
  deleteBtn: {
    padding: '0.375rem 0.75rem', background: 'none', color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)', borderRadius: '6px', fontSize: '0.8125rem', cursor: 'pointer',
  },
  empty: {
    gridColumn: '1 / -1', textAlign: 'center', padding: '3rem',
    color: 'var(--color-text-muted)', fontSize: '0.9375rem',
  },
}
