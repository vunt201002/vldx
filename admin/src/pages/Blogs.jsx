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
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  filterBtn: {
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid var(--color-border)',
    backgroundColor: '#fff',
    color: 'var(--color-text-muted)',
  },
  filterBtnActive: {
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
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
  tag: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginRight: '0.3rem',
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

export default function Blogs() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const query = filter === 'all' ? '' : `?status=${filter}`
    get(`/blog/admin/list${query}`)
      .then((response) => {
        setPosts(response.data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [filter])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading blog posts...</div>
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Blog Posts ({posts.length})</h1>
        <button
          style={styles.addBtn}
          onClick={() => navigate('/blogs/new')}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-primary-hover)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-primary)')}
        >
          + New Post
        </button>
      </div>

      <div style={styles.filters}>
        {['all', 'published', 'draft'].map((f) => (
          <button
            key={f}
            style={filter === f ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Draft'}
          </button>
        ))}
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Tags</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Views</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr
                key={post._id || idx}
                style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
              >
                <td style={{ ...styles.td, fontWeight: 600, maxWidth: '300px' }}>
                  {post.title}
                  {post.excerpt && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400, marginTop: '0.2rem' }}>
                      {post.excerpt.substring(0, 80)}{post.excerpt.length > 80 ? '...' : ''}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    backgroundColor: post.isPublished ? '#d1fae5' : '#fee2e2',
                    color: post.isPublished ? '#065f46' : '#991b1b',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ ...styles.td, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </td>
                <td style={{ ...styles.td, fontSize: '0.85rem' }}>
                  {post.viewCount || 0}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/blogs/${post._id}`)}
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
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
