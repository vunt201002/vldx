import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '@/lib/api'
import { Card, Badge, PageHeader } from '@/components/ui'
import {
  Navigation,
  Crosshair,
  Image,
  Package,
  Info,
  Star,
  Layers,
  Paintbrush,
  ListOrdered,
  Lightbulb,
  Mail,
  ChevronDown,
  Link,
  MousePointerClick,
  Sparkles,
  Square,
  ArrowRight,
  Phone,
  Users,
  FileText,
  Globe,
  BarChart3,
  Grid,
} from 'lucide-react'

// Map block types to lucide icons
const BLOCK_ICONS = {
  navbar: Navigation,
  hero: Crosshair,
  'content-image': Image,
  collections: Package,
  about: Info,
  featured: Star,
  'material-showcase': Layers,
  'color-picker': Paintbrush,
  'service-process': ListOrdered,
  'why-choose-us-v2': Lightbulb,
  contact: Mail,
  footer: ChevronDown,
  'nav-link': Link,
  'content-button': MousePointerClick,
  'product-card': Package,
  stat: BarChart3,
  'feature-card': Sparkles,
  'variant-item': Square,
  'color-swatch': Paintbrush,
  'process-step': ArrowRight,
  'contact-info': Phone,
  'social-link': Users,
  'footer-line': FileText,
  'footer-social': Globe,
}

// Block type definitions with metadata
const BLOCK_TYPES = {
  sections: [
    {
      type: 'navbar',
      name: 'Navigation Bar',
      description: 'Primary site navigation with links and branding',
      placement: 'header',
    },
    {
      type: 'hero',
      name: 'Hero Banner',
      description: 'Large header section with title, subtitle, and call-to-action',
      placement: 'body',
    },
    {
      type: 'content-image',
      name: 'Content + Image',
      description: 'Text content paired with image, configurable layout direction',
      placement: 'body',
    },
    {
      type: 'collections',
      name: 'Product Collections',
      description: 'Grid showcase of product cards with filtering options',
      placement: 'body',
    },
    {
      type: 'about',
      name: 'About Section',
      description: 'Company information with stats and highlights',
      placement: 'body',
    },
    {
      type: 'featured',
      name: 'Featured Section',
      description: 'Highlight key features or benefits with cards',
      placement: 'body',
    },
    {
      type: 'material-showcase',
      name: 'Material Showcase',
      description: 'Display product variants with images and specifications',
      placement: 'body',
    },
    {
      type: 'color-picker',
      name: 'Color Picker',
      description: 'Interactive color selection with swatches',
      placement: 'body',
    },
    {
      type: 'service-process',
      name: 'Service Process',
      description: 'Step-by-step process visualization',
      placement: 'body',
    },
    {
      type: 'why-choose-us-v2',
      name: 'Why Choose Us',
      description: 'Benefits and value propositions section',
      placement: 'body',
    },
    {
      type: 'contact',
      name: 'Contact Section',
      description: 'Contact information with form and details',
      placement: 'body',
    },
    {
      type: 'footer',
      name: 'Footer',
      description: 'Site footer with links, legal info, and social media',
      placement: 'footer',
    },
  ],
  components: [
    {
      type: 'nav-link',
      name: 'Navigation Link',
      description: 'Individual navigation menu item',
      placement: 'header',
    },
    {
      type: 'content-button',
      name: 'Content Button',
      description: 'Call-to-action button with customizable styling',
      placement: 'body',
    },
    {
      type: 'product-card',
      name: 'Product Card',
      description: 'Individual product display card',
      placement: 'body',
    },
    {
      type: 'stat',
      name: 'Statistic',
      description: 'Numerical statistic with label',
      placement: 'body',
    },
    {
      type: 'feature-card',
      name: 'Feature Card',
      description: 'Feature highlight with icon and description',
      placement: 'body',
    },
    {
      type: 'variant-item',
      name: 'Variant Item',
      description: 'Product variant option display',
      placement: 'body',
    },
    {
      type: 'color-swatch',
      name: 'Color Swatch',
      description: 'Individual color option selector',
      placement: 'body',
    },
    {
      type: 'process-step',
      name: 'Process Step',
      description: 'Individual step in a process flow',
      placement: 'body',
    },
    {
      type: 'contact-info',
      name: 'Contact Info',
      description: 'Contact detail item (phone, email, address)',
      placement: 'body',
    },
    {
      type: 'social-link',
      name: 'Social Link',
      description: 'Social media link with icon',
      placement: 'footer',
    },
    {
      type: 'footer-line',
      name: 'Footer Line',
      description: 'Footer text or link line',
      placement: 'footer',
    },
    {
      type: 'footer-social',
      name: 'Footer Social',
      description: 'Footer social media icon link',
      placement: 'footer',
    },
  ],
}

const getPlacementVariant = (placement) => {
  switch (placement) {
    case 'header':
      return 'accent'
    case 'footer':
      return 'neutral'
    case 'body':
    default:
      return 'success'
  }
}

function BlockCard({ block, onClick }) {
  const Icon = BLOCK_ICONS[block.type] || Grid

  return (
    <Card className="block-card" onClick={() => onClick(block.type)}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Icon size={24} strokeWidth={1.5} color="var(--gray-600)" />
      </div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: 6,
        }}
      >
        {block.name}
      </div>
      <div
        style={{
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--gray-50)',
          padding: '2px 8px',
          borderRadius: 4,
          display: 'inline-block',
          marginBottom: 10,
        }}
      >
        {block.type}
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        {block.description}
      </div>
      <div style={{ marginTop: 12 }}>
        <Badge variant={getPlacementVariant(block.placement)}>
          {block.placement}
        </Badge>
      </div>
    </Card>
  )
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
    <div style={{ maxWidth: 1400 }}>
      <PageHeader
        title="Block Library"
        subtitle="Browse all available block types. Click on any block to preview it with sample data."
      />

      {/* Section Blocks */}
      <div style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--color-border)',
          }}
        >
          Section Blocks
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {BLOCK_TYPES.sections.map((block) => (
            <BlockCard
              key={block.type}
              block={block}
              onClick={handleBlockClick}
            />
          ))}
        </div>
      </div>

      {/* Component Blocks */}
      <div style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--color-border)',
          }}
        >
          Component Blocks
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {BLOCK_TYPES.components.map((block) => (
            <BlockCard
              key={block.type}
              block={block}
              onClick={handleBlockClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
