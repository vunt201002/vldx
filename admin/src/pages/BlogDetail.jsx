import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, post, put, del } from '@/lib/api'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import Toast from '@/components/Toast'
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react'
import { Button, Card, Badge, FormGroup, PageHeader } from '@/components/ui'

const quillStyle = document.createElement('style')
quillStyle.textContent = '.ql-editor { min-height: 400px; }'
document.head.appendChild(quillStyle)

const isNew = (id) => id === 'new'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ align: [] }],
    ['clean'],
  ],
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'blockquote', 'code-block',
  'link', 'image', 'video', 'align',
]

const EMPTY_FORM = {
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  tags: [],
  isPublished: false,
}

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [comments, setComments] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(!isNew(id))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (isNew(id)) return

    get(`/blog/admin/${id}`)
      .then((response) => {
        const p = response.data || response
        setForm({
          title: p.title || '',
          content: p.content || '',
          excerpt: p.excerpt || '',
          coverImage: p.coverImage || '',
          tags: p.tags || [],
          isPublished: p.isPublished || false,
        })
        setComments(p.comments || [])
        setLoading(false)
      })
      .catch((err) => {
        setToast({ message: err.message || 'Failed to load blog post', type: 'error' })
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setForm((prev) => ({ ...prev, [name]: newValue }))
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const BASE = import.meta.env.VITE_API_URL
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'blog')
      const res = await fetch(`${BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      setForm((prev) => ({ ...prev, coverImage: data.data.url }))
    } catch (err) {
      setToast({ message: err.message || 'Upload failed', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      await del(`/blog/${id}/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete comment', type: 'error' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew(id)) {
        await post('/blog/admin', form)
        setToast({ message: 'Blog post created!', type: 'success' })
        setTimeout(() => navigate('/blogs'), 1200)
      } else {
        await put(`/blog/admin/${id}`, form)
        setToast({ message: 'Blog post updated!', type: 'success' })
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to save blog post', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    try {
      await del(`/blog/admin/${id}`)
      navigate('/blogs')
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete blog post', type: 'error' })
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading blog post...</div>
  }

  return (
    <div style={{ maxWidth: '900px', position: 'relative' }}>
      <PageHeader title={isNew(id) ? 'New Blog Post' : 'Edit Blog Post'}>
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/blogs')}>
          Back
        </Button>
      </PageHeader>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form id="blog-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card>
          <h3 className="card-section-title">Basic Information</h3>

          <FormGroup label={<>Title <span style={{ color: 'var(--color-danger)' }}>*</span></>} htmlFor="title">
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Huong dan chon xi mang phu hop"
            />
          </FormGroup>

          <FormGroup label="Excerpt" htmlFor="excerpt">
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              className="form-textarea"
              style={{ minHeight: '60px' }}
              placeholder="Short summary shown on blog listing..."
            />
          </FormGroup>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>Published</span>
            </label>
          </div>
        </Card>

        {/* Cover Image */}
        <Card>
          <h3 className="card-section-title">Cover Image</h3>
          <FormGroup label="Upload or paste URL">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                name="coverImage"
                type="text"
                value={form.coverImage}
                onChange={handleChange}
                className="form-input"
                style={{ flex: 1 }}
                placeholder="https://res.cloudinary.com/..."
              />
              <label className="btn btn-primary" style={{
                whiteSpace: 'nowrap',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
              }}>
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover preview"
                style={{
                  maxWidth: '300px',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  marginTop: '0.5rem',
                }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </FormGroup>
        </Card>

        {/* Content */}
        <Card>
          <h3 className="card-section-title">Content</h3>
          <FormGroup label="Content">
            <div style={{ backgroundColor: '#fff', borderRadius: '6px' }}>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
                modules={quillModules}
                formats={quillFormats}
                style={{ minHeight: '500px' }}
                placeholder="Write your blog content here..."
              />
            </div>
          </FormGroup>
        </Card>

        {/* Tags */}
        <Card>
          <h3 className="card-section-title">Tags</h3>
          <div className="form-group">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Type a tag and press Enter"
              />
              <Button variant="primary" size="sm" icon={Plus} type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="tag-list">
              {form.tags.map((tag) => (
                <Badge key={tag} variant="accent">
                  {tag}
                  <button type="button" className="tag-remove-btn" onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Comments (edit mode only) */}
        {!isNew(id) && comments.length > 0 && (
          <Card>
            <h3 className="card-section-title">Comments ({comments.length})</h3>
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div>
                    <span className="comment-name">{comment.name}</span>
                    <span className="comment-date">
                      {' '} &mdash; {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    type="button"
                    onClick={() => handleDeleteComment(comment._id)}
                    className="comment-delete-btn"
                  >
                    Delete
                  </Button>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </Card>
        )}

        {/* Sticky action bar */}
        <div style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface, #fff)',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              icon={Save}
              type="submit"
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : isNew(id) ? 'Create Post' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/blogs')}
            >
              Cancel
            </Button>
          </div>
          {!isNew(id) && (
            <Button variant="danger" icon={Trash2} type="button" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
