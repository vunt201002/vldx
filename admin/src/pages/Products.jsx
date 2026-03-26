import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '@/lib/api'

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

  useEffect(() => {
    get('/products')
      .then((response) => {
        const data = response.data || []
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

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
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Variants</th>
              <th style={styles.th}>Colors</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr
                key={product._id || idx}
                style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                <td style={{ ...styles.td, fontWeight: 600 }}>{product.name}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {product.slug}
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {product.variants?.length || 0}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {product.colors?.length || 0}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: product.isPublished ? '#d1fae5' : '#fee2e2',
                    color: product.isPublished ? '#065f46' : '#991b1b',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {product.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/products/${product._id}`)}
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
                <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
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
