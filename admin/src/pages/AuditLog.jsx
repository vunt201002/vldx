import React, { useState, useEffect } from 'react'
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
  filtersRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    minWidth: '150px',
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
  actionBadge: (action) => {
    const colors = {
      create: { bg: '#d1fae5', color: '#065f46' },
      update: { bg: '#dbeafe', color: '#1e40af' },
      delete: { bg: '#fee2e2', color: '#991b1b' },
    }
    const c = colors[action] || { bg: '#f3f4f6', color: '#374151' }
    return {
      padding: '0.2rem 0.6rem',
      backgroundColor: c.bg,
      color: c.color,
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
    }
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.25rem',
  },
  pageBtn: (active) => ({
    padding: '0.4rem 0.8rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
    color: active ? '#fff' : 'var(--color-text)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  }),
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

const ENTITY_OPTIONS = ['all', 'product', 'blog', 'menu', 'block', 'theme', 'admin']
const ACTION_OPTIONS = ['all', 'create', 'update', 'delete']
const LIMIT = 20

export default function AuditLog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [entity, setEntity] = useState('all')
  const [action, setAction] = useState('all')

  const fetchData = (p, ent, act) => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: p, limit: LIMIT })
    if (ent !== 'all') params.set('entity', ent)
    if (act !== 'all') params.set('action', act)

    get(`/audit-log?${params.toString()}`)
      .then((response) => {
        const result = response.data || response
        setEntries(result.data || [])
        setTotalPages(result.totalPages || 1)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData(page, entity, action)
  }, [page, entity, action])

  const handleEntityChange = (e) => {
    setEntity(e.target.value)
    setPage(1)
  }

  const handleActionChange = (e) => {
    setAction(e.target.value)
    setPage(1)
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Audit Log</h1>
      </div>

      <div style={styles.filtersRow}>
        <select style={styles.select} value={entity} onChange={handleEntityChange}>
          {ENTITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Entities' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
        <select style={styles.select} value={action} onChange={handleActionChange}>
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Actions' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading audit log...</div>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Admin</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Entity</th>
                  <th style={styles.th}>Name</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry._id || idx}
                    style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                  >
                    <td style={{ ...styles.td, fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(entry.createdAt)}
                    </td>
                    <td style={{ ...styles.td, fontSize: '0.85rem' }}>{entry.adminEmail}</td>
                    <td style={styles.td}>
                      <span style={styles.actionBadge(entry.action)}>{entry.action}</span>
                    </td>
                    <td style={{ ...styles.td, fontSize: '0.85rem' }}>{entry.entity}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{entry.entityName || '—'}</td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                      No audit log entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn(false)}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  style={styles.pageBtn(n === page)}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                style={styles.pageBtn(false)}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
