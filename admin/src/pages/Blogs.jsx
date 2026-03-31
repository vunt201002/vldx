import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, FileText } from 'lucide-react'
import { get } from '@/lib/api'
import { Button, Badge, Table, Th, Td, PageHeader, EmptyState, ErrorAlert } from '@/components/ui'

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
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>Loading blog posts...</div>
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div>
      <PageHeader title={`Blog Posts (${posts.length})`}>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/blogs/new')}>
          New Post
        </Button>
      </PageHeader>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['all', 'published', 'draft'].map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Draft'}
          </button>
        ))}
      </div>

      {error && <ErrorAlert message={error} />}

      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Tags</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Views</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, idx) => (
            <tr key={post._id || idx}>
              <Td style={{ fontWeight: 600, maxWidth: '300px' }}>
                {post.title}
                {post.excerpt && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400, marginTop: '0.2rem' }}>
                    {post.excerpt.substring(0, 80)}{post.excerpt.length > 80 ? '...' : ''}
                  </div>
                )}
              </Td>
              <Td>
                {(post.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="accent">{tag}</Badge>
                ))}
              </Td>
              <Td>
                <Badge variant={post.isPublished ? 'success' : 'danger'}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </Td>
              <Td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {formatDate(post.publishedAt || post.createdAt)}
              </Td>
              <Td style={{ fontSize: '0.85rem' }}>
                {post.viewCount || 0}
              </Td>
              <Td>
                <Button variant="secondary" size="sm" icon={Pencil} onClick={() => navigate(`/blogs/${post._id}`)}>
                  Edit
                </Button>
              </Td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={6}>
                <EmptyState icon={FileText} title="No blog posts found" description="Create your first blog post to get started." />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
