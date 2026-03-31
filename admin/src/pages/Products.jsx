import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Package } from 'lucide-react'
import { get } from '@/lib/api'
import { Button, Badge, Table, Th, Td, PageHeader, EmptyState, ErrorAlert } from '@/components/ui'

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
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>Loading products...</div>
  }

  return (
    <div>
      <PageHeader title={`Products (${products.length})`}>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </PageHeader>

      {error && <ErrorAlert message={error} />}

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Variants</Th>
            <Th>Colors</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={product._id || idx}>
              <Td style={{ fontWeight: 600 }}>{product.name}</Td>
              <Td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {product.slug}
              </Td>
              <Td>
                <Badge variant="neutral">{product.variants?.length || 0}</Badge>
              </Td>
              <Td>
                <Badge variant="neutral">{product.colors?.length || 0}</Badge>
              </Td>
              <Td>
                <Badge variant={product.isPublished ? 'success' : 'danger'}>
                  {product.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </Td>
              <Td>
                <Button variant="secondary" size="sm" icon={Pencil} onClick={() => navigate(`/products/${product._id}`)}>
                  Edit
                </Button>
              </Td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6}>
                <EmptyState icon={Package} title="No products found" description="Create your first product to get started." />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
