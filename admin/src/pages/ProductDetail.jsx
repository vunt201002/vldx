import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, post, put } from '@/lib/api'

const isNew = (id) => id === 'new'

const styles = {
  container: {
    maxWidth: '700px',
  },
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
    transition: 'border-color 0.15s, color 0.15s',
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
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
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
    transition: 'border-color 0.15s, box-shadow 0.15s',
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
    minHeight: '100px',
    resize: 'vertical',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)',
  },
  saveBtn: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
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
    transition: 'border-color 0.15s',
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

const EMPTY_FORM = { name: '', price: '', category: '', description: '' }

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (isNew(id)) return

    get(`/products/${id}`)
      .then((data) => {
        const product = data.product || data
        setForm({
          name: product.name || '',
          price: product.price != null ? String(product.price) : '',
          category: product.category || '',
          description: product.description || '',
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load product')
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
    }

    try {
      if (isNew(id)) {
        await post('/products', payload)
        setSuccess('Product created successfully!')
        setTimeout(() => navigate('/products'), 1200)
      } else {
        await put(`/products/${id}`, payload)
        setSuccess('Product updated successfully!')
      }
    } catch (err) {
      setError(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading product...
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/products')}
        >
          ← Back
        </button>
        <h1 style={styles.title}>{isNew(id) ? 'Add New Product' : 'Edit Product'}</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">
              Product Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. Xi mang PCB30"
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="price">
              Price (VND) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. 85000"
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. Xi mang, Gach, Cat"
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Product description..."
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={styles.footer}>
            <button
              type="submit"
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : isNew(id) ? 'Create Product' : 'Save Changes'}
            </button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
