import React, { useState, useEffect } from 'react'
import { get } from '@/lib/api'

const styles = {
  container: {
    maxWidth: '1200px',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '0.95rem',
    color: 'var(--color-text-muted)',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  iconBox: (color) => ({
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    backgroundColor: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  }),
  cardBody: {
    flex: 1,
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1,
  },
  cardLabel: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    marginTop: '0.25rem',
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  section: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--color-text)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.6rem 0.75rem',
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
    padding: '0.6rem 0.75rem',
    fontSize: '0.85rem',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--color-border)',
  },
  placeholder: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--color-text-muted)',
    fontSize: '0.9rem',
  },
  actionBadge: (action) => {
    const colors = {
      create: { bg: '#d1fae5', color: '#065f46' },
      update: { bg: '#dbeafe', color: '#1e40af' },
      delete: { bg: '#fee2e2', color: '#991b1b' },
    }
    const c = colors[action] || { bg: '#f3f4f6', color: '#374151' }
    return {
      padding: '0.15rem 0.5rem',
      backgroundColor: c.bg,
      color: c.color,
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 600,
    }
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

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [topPages, setTopPages] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      get('/analytics/summary').then((r) => r.data || r).catch(() => null),
      get('/analytics/top-pages?days=7').then((r) => r.data || r).catch(() => []),
      get('/analytics/top-products?days=7').then((r) => r.data || r).catch(() => []),
      get('/audit-log?limit=5').then((r) => r.data?.data || r.data || []).catch(() => []),
    ])
      .then(([sum, pages, products, audit]) => {
        setSummary(sum)
        setTopPages(Array.isArray(pages) ? pages : [])
        setTopProducts(Array.isArray(products) ? products : [])
        setAuditLog(Array.isArray(audit) ? audit : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading dashboard...</div>
  }

  const statCards = [
    { label: 'Views Today', value: summary?.todayViews ?? '—', icon: '👁️', color: '#2563eb' },
    { label: 'Views This Week', value: summary?.weekViews ?? '—', icon: '📈', color: '#7c3aed' },
    { label: 'Unique Today', value: summary?.todayUnique ?? '—', icon: '👤', color: '#059669' },
    { label: 'Total Events', value: summary?.totalEvents ?? '—', icon: '⚡', color: '#d97706' },
  ]

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome back!</h1>
      <p style={styles.subheading}>Here is what is happening with your store today.</p>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.iconBox(card.color)}>{card.icon}</div>
            <div style={styles.cardBody}>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardLabel}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.columnsGrid}>
        <div>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Top Pages (7 days)</h2>
            {topPages.length === 0 ? (
              <div style={styles.placeholder}>No page data yet.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Page</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.path}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{p.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Top Products (7 days)</h2>
            {topProducts.length === 0 ? (
              <div style={styles.placeholder}>No product data yet.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{p.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Audit Log</h2>
            {auditLog.length === 0 ? (
              <div style={styles.placeholder}>No audit entries yet.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Admin</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>Entity</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...styles.td, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDate(entry.createdAt)}</td>
                      <td style={{ ...styles.td, fontSize: '0.8rem' }}>{entry.adminEmail}</td>
                      <td style={styles.td}>
                        <span style={styles.actionBadge(entry.action)}>{entry.action}</span>
                      </td>
                      <td style={{ ...styles.td, fontSize: '0.8rem' }}>
                        {entry.entity}{entry.entityName ? `: ${entry.entityName}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
