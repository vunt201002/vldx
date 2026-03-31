import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, del } from '@/lib/api'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { Button, Card, Badge, PageHeader, ErrorAlert, EmptyState } from '@/components/ui'

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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading pages...</div>
  }

  return (
    <div>
      <PageHeader title="Pages" subtitle="Select a page to edit its theme, or create a new one.">
        <Button variant="primary" icon={Plus} onClick={() => setShowCreate(!showCreate)}>
          New Page
        </Button>
      </PageHeader>

      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      {showCreate && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              className="form-input"
              type="text"
              placeholder="slug (e.g. about)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              required
              style={{ flex: 1 }}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Page Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <Button variant="primary" type="submit">Create</Button>
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          </form>
        </Card>
      )}

      <div className="page-grid">
        {pages.map((page) => (
          <Card key={page.slug} className="page-card">
            <div className="page-card-body" onClick={() => navigate(`/theme-editor/${page.slug}`)}>
              <div className="page-card-slug">/{page.slug}</div>
              <h3 className="page-card-title">{page.title}</h3>
              <div className="page-card-meta">
                <span>{page.blockCount} sections</span>
                <Badge variant={page.isPublished ? 'success' : 'warning'}>
                  {page.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
            <div className="page-card-actions">
              <Button
                variant="primary"
                size="sm"
                icon={Pencil}
                onClick={() => navigate(`/theme-editor/${page.slug}`)}
                style={{ flex: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => handleDelete(page.slug)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}

        {pages.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState
              icon={FileText}
              title="No pages yet"
              description='Click "+ New Page" to create one.'
            />
          </div>
        )}
      </div>
    </div>
  )
}
