import React, { useState, useEffect } from 'react'
import { ClipboardList } from 'lucide-react'
import { get } from '@/lib/api'
import { Badge, Table, Th, Td, PageHeader, EmptyState, ErrorAlert } from '@/components/ui'

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

  const actionVariant = (act) => {
    const map = { create: 'success', update: 'accent', delete: 'danger' }
    return map[act] || 'neutral'
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div>
      <PageHeader title="Audit Log" />

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select className="form-select" value={entity} onChange={handleEntityChange}>
          {ENTITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Entities' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
        <select className="form-select" value={action} onChange={handleActionChange}>
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Actions' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>Loading audit log...</div>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Admin</Th>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>Name</Th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry._id || idx}>
                  <Td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(entry.createdAt)}
                  </Td>
                  <Td style={{ fontSize: '0.85rem' }}>{entry.adminEmail}</Td>
                  <Td>
                    <Badge variant={actionVariant(entry.action)}>{entry.action}</Badge>
                  </Td>
                  <Td style={{ fontSize: '0.85rem' }}>{entry.entity}</Td>
                  <Td style={{ fontWeight: 600 }}>{entry.entityName || '—'}</Td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={ClipboardList} title="No audit log entries found" description="Audit log entries will appear here as actions are performed." />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  className={`page-btn${n === page ? ' active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="page-btn"
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
