import React from 'react'

const statCards = [
  { label: 'Total Products', value: '—', icon: '📦', color: '#2563eb' },
  { label: 'Categories', value: '—', icon: '🗂️', color: '#7c3aed' },
  { label: 'Orders Today', value: '—', icon: '🛒', color: '#059669' },
  { label: 'Revenue (Month)', value: '—', icon: '💰', color: '#d97706' },
]

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
  section: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--color-text)',
  },
  placeholder: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--color-text-muted)',
    fontSize: '0.9rem',
  },
}

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome back!</h1>
      <p style={styles.subheading}>Here is what is happening with your store today.</p>

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

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.placeholder}>
          No recent activity to display. Connect your backend API to see live data.
        </div>
      </div>
    </div>
  )
}
