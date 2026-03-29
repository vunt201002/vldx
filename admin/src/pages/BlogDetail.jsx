import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, post, put, del } from '@/lib/api'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const quillStyle = document.createElement('style')
quillStyle.textContent = '.ql-editor { min-height: 400px; }'
document.head.appendChild(quillStyle)

const isNew = (id) => id === 'new'

const styles = {
  container: { maxWidth: '900px' },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  backBtn: {
    background: 'none',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '0.45rem 0.9rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    padding: '1.75rem',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--color-border)',
  },
  formGroup: { marginBottom: '1.25rem' },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '0.4rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.85rem',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%',
    padding: '0.6rem 0.85rem',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    backgroundColor: '#fff',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.15s',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '0.25rem',
  },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  coverPreview: {
    maxWidth: '300px',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    marginTop: '0.5rem',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginTop: '0.5rem',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.25rem 0.6rem',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    color: '#3730a3',
    cursor: 'pointer',
    fontSize: '1rem',
    lineHeight: 1,
    padding: 0,
  },
  commentItem: {
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    border: '1px solid var(--color-border)',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.3rem',
  },
  commentName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  commentDate: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },
  commentContent: {
    fontSize: '0.85rem',
    color: 'var(--color-text)',
  },
  deleteCommentBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-danger)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)',
  },
  footerLeft: { display: 'flex', gap: '0.75rem' },
  saveBtn: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    padding: '0.65rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  errorBox: {
    padding: '0.75rem 1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 'var(--radius)',
    color: 'var(--color-danger)',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  successBox: {
    padding: '0.75rem 1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 'var(--radius)',
    color: '#166534',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
}

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
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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
        setError(err.message || 'Failed to load blog post')
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setForm((prev) => ({ ...prev, [name]: newValue }))
    setError(null)
    setSuccess(null)
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
    setError(null)
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
      setError(err.message || 'Upload failed')
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
      setError(err.message || 'Failed to delete comment')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (isNew(id)) {
        await post('/blog/admin', form)
        setSuccess('Blog post created!')
        setTimeout(() => navigate('/blogs'), 1200)
      } else {
        await put(`/blog/admin/${id}`, form)
        setSuccess('Blog post updated!')
      }
    } catch (err) {
      setError(err.message || 'Failed to save blog post')
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
      setError(err.message || 'Failed to delete blog post')
    }
  }

  const focusStyle = (e) => (e.target.style.borderColor = 'var(--color-primary)')
  const blurStyle = (e) => (e.target.style.borderColor = 'var(--color-border)')

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading blog post...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/blogs')}>
          ← Back
        </button>
        <h1 style={styles.title}>{isNew(id) ? 'New Blog Post' : 'Edit Blog Post'}</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Basic Information</div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="title">
              Title <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. Hướng dẫn chọn xi măng phù hợp"
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              style={{ ...styles.textarea, minHeight: '60px' }}
              placeholder="Short summary shown on blog listing..."
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Published</span>
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Cover Image</div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload or paste URL</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                name="coverImage"
                type="text"
                value={form.coverImage}
                onChange={handleChange}
                style={{ ...styles.input, flex: 1 }}
                placeholder="https://res.cloudinary.com/..."
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <label style={{
                ...styles.saveBtn,
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
                display: 'inline-block',
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
                style={styles.coverPreview}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Content</div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Content</label>
            <div style={{ backgroundColor: '#fff', borderRadius: '6px' }}>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, content: value }))
                  setError(null)
                  setSuccess(null)
                }}
                modules={quillModules}
                formats={quillFormats}
                style={{ minHeight: '500px' }}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Tags</div>
          <div style={styles.formGroup}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                style={{ ...styles.input, flex: 1 }}
                placeholder="Type a tag and press Enter"
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={addTag}
                style={{
                  ...styles.saveBtn,
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Add
              </button>
            </div>
            <div style={styles.tagList}>
              {form.tags.map((tag) => (
                <span key={tag} style={styles.tag}>
                  {tag}
                  <button type="button" style={styles.tagRemove} onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comments (edit mode only) */}
        {!isNew(id) && comments.length > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Comments ({comments.length})</div>
            {comments.map((comment) => (
              <div key={comment._id} style={styles.commentItem}>
                <div style={styles.commentHeader}>
                  <div>
                    <span style={styles.commentName}>{comment.name}</span>
                    <span style={styles.commentDate}>
                      {' '}— {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    style={styles.deleteCommentBtn}
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                </div>
                <div style={styles.commentContent}>{comment.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div style={styles.footer}>
          <div style={styles.footerLeft}>
            <button
              type="submit"
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : isNew(id) ? 'Create Post' : 'Save Changes'}
            </button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/blogs')}
            >
              Cancel
            </button>
          </div>
          {!isNew(id) && (
            <button
              type="button"
              style={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete Post
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
