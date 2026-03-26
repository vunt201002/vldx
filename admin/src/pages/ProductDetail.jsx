import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, post, put, del } from '@/lib/api'

const isNew = (id) => id === 'new'

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const styles = {
  container: {
    maxWidth: '900px',
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
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '0.25rem',
  },
  itemRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    alignItems: 'flex-start',
  },
  addBtn: {
    backgroundColor: '#f8fafc',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    padding: '0.6rem 1rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    width: '100%',
    marginTop: '0.5rem',
  },
  removeBtn: {
    backgroundColor: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 0.8rem',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  colorPreview: {
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    border: '2px solid var(--color-border)',
  },
  imagePreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)',
  },
  footerLeft: {
    display: 'flex',
    gap: '0.75rem',
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
  deleteBtn: {
    backgroundColor: 'var(--color-danger)',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
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

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  variants: [],
  colors: [],
  images: [],
  isPublished: false,
}

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
      .then((response) => {
        const product = response.data || response
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          variants: product.variants || [],
          colors: product.colors || [],
          images: product.images || [],
          isPublished: product.isPublished || false,
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load product')
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setForm((prev) => {
      const updated = { ...prev, [name]: newValue }

      // Auto-generate slug from name
      if (name === 'name' && (isNew(id) || !prev.slug)) {
        updated.slug = generateSlug(value)
      }

      return updated
    })
    setError(null)
    setSuccess(null)
  }

  // Variant management
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', sku: '', price: 0 }],
    }))
  }

  const updateVariant = (index, field, value) => {
    setForm((prev) => {
      const variants = [...prev.variants]
      variants[index] = { ...variants[index], [field]: value }
      return { ...prev, variants }
    })
  }

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  // Color management
  const addColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000', image: '' }],
    }))
  }

  const updateColor = (index, field, value) => {
    setForm((prev) => {
      const colors = [...prev.colors]
      colors[index] = { ...colors[index], [field]: value }
      return { ...prev, colors }
    })
  }

  const removeColor = (index) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }))
  }

  // Image management
  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }))
    }
  }

  const updateImage = (index, value) => {
    setForm((prev) => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (isNew(id)) {
        await post('/products', form)
        setSuccess('Product created successfully!')
        setTimeout(() => navigate('/products'), 1200)
      } else {
        await put(`/products/${id}`, form)
        setSuccess('Product updated successfully!')
      }
    } catch (err) {
      setError(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await del(`/products/${id}`)
      navigate('/products')
    } catch (err) {
      setError(err.message || 'Failed to delete product')
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
        <button style={styles.backBtn} onClick={() => navigate('/products')}>
          ← Back
        </button>
        <h1 style={styles.title}>{isNew(id) ? 'Add New Product' : 'Edit Product'}</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Basic Information</div>

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
              placeholder="e.g. Tấm ốp cầu thang"
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="slug">
              Slug <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={form.slug}
              onChange={handleChange}
              style={styles.input}
              placeholder="tam-op-cau-thang"
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
            />
            <div style={styles.helpText}>Auto-generated from name. Must be unique.</div>
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

        {/* Variants */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Variants</div>

          {form.variants.map((variant, idx) => (
            <div key={idx} style={styles.itemRow}>
              <input
                type="text"
                value={variant.name}
                onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                placeholder="Variant name"
                style={{ ...styles.input, flex: 2 }}
              />
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                placeholder="SKU"
                style={{ ...styles.input, flex: 1 }}
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                style={{ ...styles.input, flex: 1 }}
                min="0"
              />
              <button
                type="button"
                style={styles.removeBtn}
                onClick={() => removeVariant(idx)}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" style={styles.addBtn} onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        {/* Colors */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Colors</div>

          {form.colors.map((color, idx) => (
            <div key={idx} style={styles.itemRow}>
              <div style={{ ...styles.colorPreview, backgroundColor: color.hex }}></div>
              <input
                type="text"
                value={color.name}
                onChange={(e) => updateColor(idx, 'name', e.target.value)}
                placeholder="Color name"
                style={{ ...styles.input, flex: 1 }}
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                style={{ width: '60px', height: '40px', cursor: 'pointer', border: '1px solid var(--color-border)', borderRadius: '6px' }}
              />
              <input
                type="text"
                value={color.image}
                onChange={(e) => updateColor(idx, 'image', e.target.value)}
                placeholder="Image URL (optional)"
                style={{ ...styles.input, flex: 2 }}
              />
              <button
                type="button"
                style={styles.removeBtn}
                onClick={() => removeColor(idx)}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" style={styles.addBtn} onClick={addColor}>
            + Add Color
          </button>
        </div>

        {/* Images */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Product Images</div>

          {form.images.map((image, idx) => (
            <div key={idx} style={styles.itemRow}>
              {image && (
                <img
                  src={image}
                  alt={`Product ${idx + 1}`}
                  style={styles.imagePreview}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <input
                type="text"
                value={image}
                onChange={(e) => updateImage(idx, e.target.value)}
                placeholder="Image URL"
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                style={styles.removeBtn}
                onClick={() => removeImage(idx)}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" style={styles.addBtn} onClick={addImage}>
            + Add Image
          </button>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <div style={styles.footerLeft}>
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
          {!isNew(id) && (
            <button
              type="button"
              style={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete Product
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
