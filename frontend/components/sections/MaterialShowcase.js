import { useState } from 'react';

export default function MaterialShowcase({ settings, blocks }) {
  const variants = (blocks || []).filter((b) => b.type === 'variant-item');
  const [selected, setSelected] = useState(0);

  const previewLeft = settings.previewPosition !== 'right';
  const showSpecs = settings.showSpecs !== false;
  const bgColor = settings.bgColor || '';
  const current = variants[selected]?.settings || {};

  if (variants.length === 0) return null;

  return (
    <section
      className="font-body"
      style={{ backgroundColor: bgColor || undefined, padding: '4rem 0' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2.5rem' }}>
        {/* Header */}
        {(settings.overline || settings.title) && (
          <div style={{ marginBottom: '2rem' }}>
            {settings.overline && (
              <span style={{
                display: 'block', fontSize: '0.75rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#C4A882', marginBottom: '0.75rem',
              }}>
                {settings.overline}
              </span>
            )}
            {settings.title && (
              <h2 className="font-display" style={{ fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.2 }}>
                {settings.title}{' '}
                {settings.titleAccent && <span style={{ fontStyle: 'italic', color: '#C4A882' }}>{settings.titleAccent}</span>}
              </h2>
            )}
            {settings.description && (
              <p style={{ marginTop: '1rem', fontSize: '1rem', lineHeight: 1.7, color: '#6B5D4E', maxWidth: '600px' }}>
                {settings.description}
              </p>
            )}
          </div>
        )}

        {/* Main: thumbnails + preview + info — all in one row */}
        <div className="ms-main" style={{
          display: 'flex',
          flexDirection: previewLeft ? 'row' : 'row-reverse',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}>
          {/* Thumbnails — vertical strip on the side */}
          <div className="ms-thumbs-col" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '80px',
            flexShrink: 0,
            maxHeight: '500px',
            overflowY: 'auto',
          }}>
            {variants.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  border: i === selected ? '2px solid #C4A882' : '2px solid transparent',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  background: '#f0ece7',
                  flexShrink: 0,
                }}
              >
                <img
                  src={v.settings.image}
                  alt={v.settings.name || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                {v.settings.tag && (
                  <span style={{
                    position: 'absolute', top: '2px', left: '2px',
                    fontSize: '0.5rem', padding: '1px 4px', borderRadius: '999px',
                    backgroundColor: '#C4A882', color: 'white', textTransform: 'uppercase',
                  }}>
                    {v.settings.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Preview image */}
          <div style={{
            flex: '1 1 55%',
            position: 'relative',
            height: '500px',
            overflow: 'hidden',
            borderRadius: '4px',
            backgroundColor: '#f0ece7',
          }}>
            {variants.map((v, i) => (
              <img
                key={i}
                src={v.settings.image}
                alt={v.settings.name || ''}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'opacity 0.5s ease',
                  opacity: i === selected ? 1 : 0,
                }}
              />
            ))}
          </div>

          {/* Info panel */}
          <div style={{ flex: '1 1 30%', paddingTop: '0.5rem' }}>
            {current.tag && (
              <span style={{
                display: 'inline-block', fontSize: '0.6875rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '999px',
                backgroundColor: '#C4A882', color: 'white', marginBottom: '1rem',
              }}>
                {current.tag}
              </span>
            )}
            <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>
              {current.name}
            </h3>
            {current.description && (
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: '#6B5D4E', marginBottom: '1rem' }}>
                {current.description}
              </p>
            )}
            {showSpecs && current.specs && (
              <p style={{
                fontSize: '0.8125rem', color: '#8B7D6B',
                borderTop: '1px solid #E8E0D6', paddingTop: '1rem', marginTop: '1rem',
              }}>
                {current.specs}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .ms-main {
            flex-direction: column !important;
          }
          .ms-thumbs-col {
            flex-direction: row !important;
            width: 100% !important;
            max-height: none !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          .ms-thumbs-col button {
            width: 64px !important;
            height: 64px !important;
          }
        }
      `}</style>
    </section>
  );
}
