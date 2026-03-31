import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, post, put, del } from '@/lib/api'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { Button, Card, FormGroup, ErrorAlert, PageHeader } from '@/components/ui'

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
    <div style={{ maxWidth: '900px' }}>
      <PageHeader title={isNew(id) ? 'Add New Product' : 'Edit Product'}>
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/products')}>
          Back
        </Button>
      </PageHeader>

      <ErrorAlert message={error} onDismiss={() => setError(null)} />
      {success && <div className="success-alert">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card>
          <h3 className="card-section-title">Basic Information</h3>

          <FormGroup label={<>Product Name <span style={{ color: 'var(--color-danger)' }}>*</span></>} htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Tam op cau thang"
            />
          </FormGroup>

          <FormGroup label={<>Slug <span style={{ color: 'var(--color-danger)' }}>*</span></>} htmlFor="slug" help="Auto-generated from name. Must be unique.">
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={form.slug}
              onChange={handleChange}
              className="form-input"
              placeholder="tam-op-cau-thang"
            />
          </FormGroup>

          <FormGroup label="Description" htmlFor="description">
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Product description..."
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

        {/* Variants */}
        <Card>
          <h3 className="card-section-title">Variants</h3>

          {form.variants.map((variant, idx) => (
            <div key={idx} className="item-row">
              <input
                type="text"
                value={variant.name}
                onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                placeholder="Variant name"
                className="form-input"
                style={{ flex: 2 }}
              />
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                placeholder="SKU"
                className="form-input"
                style={{ flex: 1 }}
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="form-input"
                style={{ flex: 1 }}
                min="0"
              />
              <Button variant="danger" size="sm" icon={Trash2} type="button" onClick={() => removeVariant(idx)}>
                Remove
              </Button>
            </div>
          ))}

          <Button variant="secondary" icon={Plus} type="button" onClick={addVariant} className="btn-full-width">
            Add Variant
          </Button>
        </Card>

        {/* Colors */}
        <Card>
          <h3 className="card-section-title">Colors</h3>

          {form.colors.map((color, idx) => (
            <div key={idx} className="item-row">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '2px solid var(--color-border)',
                backgroundColor: color.hex,
                flexShrink: 0,
              }} />
              <input
                type="text"
                value={color.name}
                onChange={(e) => updateColor(idx, 'name', e.target.value)}
                placeholder="Color name"
                className="form-input"
                style={{ flex: 1 }}
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
                className="form-input"
                style={{ flex: 2 }}
              />
              <Button variant="danger" size="sm" icon={Trash2} type="button" onClick={() => removeColor(idx)}>
                Remove
              </Button>
            </div>
          ))}

          <Button variant="secondary" icon={Plus} type="button" onClick={addColor} className="btn-full-width">
            Add Color
          </Button>
        </Card>

        {/* Images */}
        <Card>
          <h3 className="card-section-title">Product Images</h3>

          {form.images.map((image, idx) => (
            <div key={idx} className="item-row">
              {image && (
                <img
                  src={image}
                  alt={`Product ${idx + 1}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <input
                type="text"
                value={image}
                onChange={(e) => updateImage(idx, e.target.value)}
                placeholder="Image URL"
                className="form-input"
                style={{ flex: 1 }}
              />
              <Button variant="danger" size="sm" icon={Trash2} type="button" onClick={() => removeImage(idx)}>
                Remove
              </Button>
            </div>
          ))}

          <Button variant="secondary" icon={Plus} type="button" onClick={addImage} className="btn-full-width">
            Add Image
          </Button>
        </Card>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              icon={Save}
              type="submit"
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : isNew(id) ? 'Create Product' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
          </div>
          {!isNew(id) && (
            <Button variant="danger" icon={Trash2} type="button" onClick={handleDelete}>
              Delete Product
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
