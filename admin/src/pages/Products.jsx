import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '@/lib/api'

const PLACEHOLDER_PRODUCTS = [
  { _id: '1', name: 'Xi mang PCB30', price: 85000, category: 'Xi mang', description: 'Xi mang Portland PCB30' },
  { _id: '2', name: 'Gach the 4x8', price: 1200, category: 'Gach', description: 'Gach the xay dung 4x8cm' },
  { _id: '3', name: 'Cat vang', price: 250000, category: 'Vat lieu nen', description: 'Cat vang hat min' },
]

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  addBtn: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  tableWrapper: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid var(--color-border)',
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--color-border)',
  },
  editBtn: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    padding: '0.35rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s, color 0.15s',
  },
  notice: {
    padding: '0.75rem 1rem',
    backgroundColor: '#fffbeb',
    borderBottom: '1px solid #fde68a',
    fontSize: '0.85rem',
    color: '#92400e',
  },
  errorBox: {
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 'var(--radius)',
    color: 'var(--color-danger)',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingPlaceholder, setUsingPlaceholder] = useState(false)

  useEffect(() => {
    get('/products')
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || [])
        setLoading(false)
      })
      .catch(() => {
        setProducts(PLACEHOLDER_PRODUCTS)
        setUsingPlaceholder(true)
        setLoading(false)
      })
  }, [])

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading products...</div>
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Products ({products.length})</h1>
        <button
          style={styles.addBtn}
          onClick={() => navigate('/products/new')}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-primary)')}
        >
          + Add Product
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableWrapper}>
        {usingPlaceholder && (
          <div style={styles.notice}>
            Showing placeholder data — backend API is not connected.
          </div>
        )}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr
                key={product._id || product.id || idx}
                style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                <td style={{ ...styles.td, fontWeight: 600 }}>{product.name}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {product.category || 'N/A'}
                  </span>
                </td>
                <td style={styles.td}>{formatPrice(product.price)}</td>
                <td style={{ ...styles.td, color: 'var(--color-text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.description || '—'}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/products/${product._id || product.id}`)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-primary)'
                      e.target.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = 'var(--color-primary)'
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
