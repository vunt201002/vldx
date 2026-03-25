import React, { useReducer } from 'react'
import { post } from '../lib/api'

const statCards = [
  { label: 'Total Products', value: '—', icon: '📦', color: '#2563eb' },
  { label: 'Categories', value: '—', icon: '🗂️', color: '#7c3aed' },
  { label: 'Orders Today', value: '—', icon: '🛒', color: '#059669' },
  { label: 'Revenue (Month)', value: '—', icon: '💰', color: '#d97706' },
]

// Reducer for sync button state
const syncReducer = (state, action) => {
  switch (action.type) {
    case 'SYNCING':
      return { status: 'syncing', error: null, message: null }
    case 'SUCCESS':
      return { status: 'success', error: null, message: action.message }
    case 'ERROR':
      return { status: 'idle', error: action.error, message: null }
    case 'CLEAR':
      return { status: 'idle', error: null, message: null }
    default:
      return state
  }
}

const initialSyncState = { status: 'idle', error: null, message: null }

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
  syncSection: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    marginBottom: '2rem',
  },
  syncButton: (isDisabled) => ({
    padding: '0.5rem 1rem',
    backgroundColor: isDisabled ? 'var(--color-border)' : 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  syncDescription: {
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    marginBottom: '1rem',
  },
  successMessage: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
  errorMessage: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
}

export default function Dashboard() {
  const [syncState, syncDispatch] = useReducer(syncReducer, initialSyncState)

  const handleSync = async () => {
    syncDispatch({ type: 'SYNCING' })
    try {
      const result = await post('/theme/sync')
      syncDispatch({
        type: 'SUCCESS',
        message: result.message || 'Sync completed successfully',
      })
      // Clear success message after 3 seconds
      setTimeout(() => syncDispatch({ type: 'CLEAR' }), 3000)
    } catch (err) {
      syncDispatch({
        type: 'ERROR',
        error: err.message || 'Sync failed',
      })
      // Clear error after 5 seconds
      setTimeout(() => syncDispatch({ type: 'CLEAR' }), 5000)
    }
  }

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

      {/* Sync Section */}
      <div style={styles.syncSection}>
        <h2 style={styles.sectionTitle}>Page Configuration</h2>
        <p style={styles.syncDescription}>
          Manually sync all page JSON files from MongoDB. Use this after running seed scripts or making direct database changes.
        </p>

        <button
          onClick={handleSync}
          disabled={syncState.status === 'syncing'}
          style={styles.syncButton(syncState.status === 'syncing')}
        >
          {syncState.status === 'syncing' ? 'Syncing...' : 'Sync All Page JSONs'}
        </button>

        {/* Success/Error Messages */}
        {syncState.message && (
          <div style={styles.successMessage}>
            ✓ {syncState.message}
          </div>
        )}

        {syncState.error && (
          <div style={styles.errorMessage}>
            ✗ {syncState.error}
          </div>
        )}
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
