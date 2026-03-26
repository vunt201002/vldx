import React from 'react'

// Simple visual renderer for block previews
// This shows how blocks would look on the frontend
export default function BlockRenderer({ type, settings, blocks = [] }) {
  const baseStyles = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5,
  }

  // Render based on block type
  switch (type) {
    case 'navbar':
      return (
        <nav style={{ backgroundColor: '#1e293b', padding: '1rem 2rem', color: 'white', ...baseStyles }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{settings.logo || 'Logo'}</div>
            <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }}>
              {blocks.map((block, i) => (
                <a key={i} href={block.settings?.url || '#'} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>
                  {block.settings?.label || `Link ${i + 1}`}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )

    case 'hero':
      return (
        <div
          style={{
            backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'white',
            ...baseStyles,
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>{settings.title || 'Hero Title'}</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>{settings.subtitle || 'Hero subtitle text'}</p>
            {settings.ctaText && (
              <button
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {settings.ctaText}
              </button>
            )}
          </div>
        </div>
      )

    case 'content-image':
      const isImageLeft = settings.direction === 'image-left'
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f8fafc', ...baseStyles }}>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {isImageLeft && settings.imageUrl && (
              <img src={settings.imageUrl} alt="" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
            )}
            <div>
              {settings.title && <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{settings.title}</h2>}
              {settings.description && <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>{settings.description}</p>}
              {blocks.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  {blocks.map((block, i) => (
                    <button
                      key={i}
                      style={{
                        backgroundColor: block.settings?.bgColor || '#2563eb',
                        color: block.settings?.color || 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginRight: '0.75rem',
                      }}
                    >
                      {block.settings?.label || 'Button'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!isImageLeft && settings.imageUrl && (
              <img src={settings.imageUrl} alt="" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
            )}
          </div>
        </div>
      )

    case 'collections':
    case 'product-card':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: 'white', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {settings.overline && <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{settings.overline}</div>}
            {settings.title && (
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                {settings.title} {settings.titleAccent && <span style={{ color: '#2563eb' }}>{settings.titleAccent}</span>}
              </h2>
            )}
            {settings.description && <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>{settings.description}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {blocks.map((block, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  {block.settings?.image && (
                    <img src={block.settings.image} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{block.settings?.name || 'Product Name'}</h3>
                    {block.settings?.desc && <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>{block.settings.desc}</p>}
                    {block.settings?.specs && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{block.settings.specs}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'about':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f1f5f9', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            {settings.overline && <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{settings.overline}</div>}
            {settings.title && (
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                {settings.title} {settings.titleAccent && <span style={{ color: '#2563eb' }}>{settings.titleAccent}</span>}
              </h2>
            )}
            {settings.description && <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>{settings.description}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {blocks.map((block, i) => (
                <div key={i}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.5rem' }}>{block.settings?.value || '0'}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{block.settings?.label || 'Metric'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'featured':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: 'white', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {settings.overline && <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', textAlign: 'center' }}>{settings.overline}</div>}
            {settings.title && (
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', textAlign: 'center' }}>
                {settings.title} {settings.titleAccent && <span style={{ color: '#2563eb' }}>{settings.titleAccent}</span>}
              </h2>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {blocks.map((block, i) => (
                <div key={i} style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{block.settings?.icon || '✨'}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{block.settings?.title || 'Feature'}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{block.settings?.description || 'Feature description'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'material-showcase':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f8fafc', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {settings.title && <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{settings.title}</h2>}
            {settings.subtitle && <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>{settings.subtitle}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {blocks.map((block, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {block.settings?.image && <img src={block.settings.image} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{block.settings?.name || 'Material'}</h3>
                    {block.settings?.description && <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>{block.settings.description}</p>}
                    {block.settings?.price && <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2563eb' }}>{block.settings.price}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'color-picker':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: 'white', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {settings.title && <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{settings.title}</h2>}
            {settings.subtitle && <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>{settings.subtitle}</p>}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {blocks.map((block, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: block.settings?.hex || '#cccccc',
                      borderRadius: '12px',
                      marginBottom: '0.5rem',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{block.settings?.name || 'Color'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'service-process':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: '#f8fafc', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {settings.overline && <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', textAlign: 'center' }}>{settings.overline}</div>}
            {settings.title && (
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>
                {settings.title} {settings.titleAccent && <span style={{ color: '#2563eb' }}>{settings.titleAccent}</span>}
              </h2>
            )}
            {settings.description && <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '3rem', textAlign: 'center' }}>{settings.description}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {blocks.map((block, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '1rem' }}>{block.settings?.step || `0${i + 1}`}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{block.settings?.title || 'Step'}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{block.settings?.description || 'Step description'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'contact':
      return (
        <div style={{ padding: '3rem 2rem', backgroundColor: 'white', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              {settings.overline && <div style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{settings.overline}</div>}
              {settings.title && (
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                  {settings.title} {settings.titleAccent && <span style={{ color: '#2563eb' }}>{settings.titleAccent}</span>}
                </h2>
              )}
              {settings.description && <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>{settings.description}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {blocks.filter(b => b.type === 'contact-info').map((block, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>{block.settings?.icon || '📧'}</div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{block.settings?.label || 'Label'}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600 }}>{block.settings?.value || 'Value'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{settings.formTitle || 'Get in Touch'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Name" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }} />
                <input type="email" placeholder="Email" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem' }} />
                <textarea placeholder="Message" rows={4} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }} />
                <button style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )

    case 'footer':
      return (
        <footer style={{ backgroundColor: '#1e293b', padding: '3rem 2rem 2rem', color: '#cbd5e1', ...baseStyles }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>VLXD</div>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{settings.tagline || 'Your tagline here'}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {blocks.filter(b => b.type === 'footer-line').map((block, i) => (
                    <a key={i} href={block.settings?.url || '#'} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.875rem' }}>
                      {block.settings?.text || 'Link'}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {blocks.filter(b => b.type === 'footer-social' || b.type === 'social-link').map((block, i) => (
                    <a
                      key={i}
                      href={block.settings?.url || '#'}
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#334155',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        fontSize: '1.125rem',
                      }}
                    >
                      {block.settings?.platform?.[0]?.toUpperCase() || '•'}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
              {settings.copyright || '© 2024 All rights reserved'}
            </div>
          </div>
        </footer>
      )

    // Component blocks (simple renderers)
    case 'nav-link':
      return (
        <a href={settings.url || '#'} style={{ color: '#cbd5e1', textDecoration: 'none', padding: '0.5rem 1rem', display: 'inline-block', ...baseStyles }}>
          {settings.label || 'Link'}
        </a>
      )

    case 'content-button':
      return (
        <button
          style={{
            backgroundColor: settings.bgColor || '#2563eb',
            color: settings.color || 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            ...baseStyles,
          }}
        >
          {settings.label || 'Button'}
        </button>
      )

    case 'stat':
      return (
        <div style={{ textAlign: 'center', padding: '1rem', ...baseStyles }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.5rem' }}>{settings.value || '0'}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{settings.label || 'Statistic'}</div>
        </div>
      )

    default:
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', ...baseStyles }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧩</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Block Type: {type}</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Preview not available for this block type</div>
        </div>
      )
  }
}
