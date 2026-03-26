import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '@/lib/api'

const styles = {
  container: {
    maxWidth: '1400px',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--color-text-muted)',
  },
  categorySection: {
    marginBottom: '3rem',
  },
  categoryTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--color-border)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  blockCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--color-border)',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  blockIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  blockName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  blockType: {
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: 'var(--color-text-muted)',
    backgroundColor: '#f8fafc',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '0.75rem',
  },
  blockDescription: {
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },
  placementBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.25rem 0.5rem',
    borderRadius: '999px',
    display: 'inline-block',
    marginTop: '0.75rem',
  },
}

// Block type definitions with metadata
const BLOCK_TYPES = {
  sections: [
    {
      type: 'navbar',
      name: 'Navigation Bar',
      icon: '📋',
      description: 'Primary site navigation with links and branding',
      placement: 'header',
    },
    {
      type: 'hero',
      name: 'Hero Banner',
      icon: '🎯',
      description: 'Large header section with title, subtitle, and call-to-action',
      placement: 'body',
    },
    {
      type: 'content-image',
      name: 'Content + Image',
      icon: '🖼️',
      description: 'Text content paired with image, configurable layout direction',
      placement: 'body',
    },
    {
      type: 'collections',
      name: 'Product Collections',
      icon: '📦',
      description: 'Grid showcase of product cards with filtering options',
      placement: 'body',
    },
    {
      type: 'about',
      name: 'About Section',
      icon: 'ℹ️',
      description: 'Company information with stats and highlights',
      placement: 'body',
    },
    {
      type: 'featured',
      name: 'Featured Section',
      icon: '⭐',
      description: 'Highlight key features or benefits with cards',
      placement: 'body',
    },
    {
      type: 'material-showcase',
      name: 'Material Showcase',
      icon: '🎨',
      description: 'Display product variants with images and specifications',
      placement: 'body',
    },
    {
      type: 'color-picker',
      name: 'Color Picker',
      icon: '🎨',
      description: 'Interactive color selection with swatches',
      placement: 'body',
    },
    {
      type: 'service-process',
      name: 'Service Process',
      icon: '📊',
      description: 'Step-by-step process visualization',
      placement: 'body',
    },
    {
      type: 'why-choose-us-v2',
      name: 'Why Choose Us',
      icon: '💡',
      description: 'Benefits and value propositions section',
      placement: 'body',
    },
    {
      type: 'contact',
      name: 'Contact Section',
      icon: '📧',
      description: 'Contact information with form and details',
      placement: 'body',
    },
    {
      type: 'footer',
      name: 'Footer',
      icon: '⬇️',
      description: 'Site footer with links, legal info, and social media',
      placement: 'footer',
    },
  ],
  components: [
    {
      type: 'nav-link',
      name: 'Navigation Link',
      icon: '🔗',
      description: 'Individual navigation menu item',
      placement: 'header',
    },
    {
      type: 'content-button',
      name: 'Content Button',
      icon: '🔘',
      description: 'Call-to-action button with customizable styling',
      placement: 'body',
    },
    {
      type: 'product-card',
      name: 'Product Card',
      icon: '📦',
      description: 'Individual product display card',
      placement: 'body',
    },
    {
      type: 'stat',
      name: 'Statistic',
      icon: '📊',
      description: 'Numerical statistic with label',
      placement: 'body',
    },
    {
      type: 'feature-card',
      name: 'Feature Card',
      icon: '✨',
      description: 'Feature highlight with icon and description',
      placement: 'body',
    },
    {
      type: 'variant-item',
      name: 'Variant Item',
      icon: '🔲',
      description: 'Product variant option display',
      placement: 'body',
    },
    {
      type: 'color-swatch',
      name: 'Color Swatch',
      icon: '🎨',
      description: 'Individual color option selector',
      placement: 'body',
    },
    {
      type: 'process-step',
      name: 'Process Step',
      icon: '➡️',
      description: 'Individual step in a process flow',
      placement: 'body',
    },
    {
      type: 'contact-info',
      name: 'Contact Info',
      icon: '📞',
      description: 'Contact detail item (phone, email, address)',
      placement: 'body',
    },
    {
      type: 'social-link',
      name: 'Social Link',
      icon: '👥',
      description: 'Social media link with icon',
      placement: 'footer',
    },
    {
      type: 'footer-line',
      name: 'Footer Line',
      icon: '📝',
      description: 'Footer text or link line',
      placement: 'footer',
    },
    {
      type: 'footer-social',
      name: 'Footer Social',
      icon: '🌐',
      description: 'Footer social media icon link',
      placement: 'footer',
    },
  ],
}

const getPlacementColor = (placement) => {
  switch (placement) {
    case 'header':
      return { backgroundColor: '#dbeafe', color: '#1e40af' }
    case 'footer':
      return { backgroundColor: '#e0e7ff', color: '#4338ca' }
    case 'body':
    default:
      return { backgroundColor: '#dcfce7', color: '#166534' }
  }
}

export default function BlockLibrary() {
  const navigate = useNavigate()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all blocks from API
    get('/blocks')
      .then((response) => {
        setBlocks(response.data || [])
      })
      .catch((err) => {
        console.error('Failed to load blocks:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleBlockClick = (blockType) => {
    navigate(`/blocks/preview?type=${blockType}`)
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading block library...
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Block Library</h1>
        <p style={styles.subtitle}>
          Browse all available block types. Click on any block to preview it with sample data.
        </p>
      </div>

      {/* Section Blocks */}
      <div style={styles.categorySection}>
        <h2 style={styles.categoryTitle}>Section Blocks</h2>
        <div style={styles.grid}>
          {BLOCK_TYPES.sections.map((block) => (
            <div
              key={block.type}
              style={styles.blockCard}
              onClick={() => handleBlockClick(block.type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={styles.blockIcon}>{block.icon}</div>
              <div style={styles.blockName}>{block.name}</div>
              <div style={styles.blockType}>{block.type}</div>
              <div style={styles.blockDescription}>{block.description}</div>
              <div
                style={{
                  ...styles.placementBadge,
                  ...getPlacementColor(block.placement),
                }}
              >
                {block.placement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Blocks */}
      <div style={styles.categorySection}>
        <h2 style={styles.categoryTitle}>Component Blocks</h2>
        <div style={styles.grid}>
          {BLOCK_TYPES.components.map((block) => (
            <div
              key={block.type}
              style={styles.blockCard}
              onClick={() => handleBlockClick(block.type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={styles.blockIcon}>{block.icon}</div>
              <div style={styles.blockName}>{block.name}</div>
              <div style={styles.blockType}>{block.type}</div>
              <div style={styles.blockDescription}>{block.description}</div>
              <div
                style={{
                  ...styles.placementBadge,
                  ...getPlacementColor(block.placement),
                }}
              >
                {block.placement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
