import { useState } from 'react';
import { trackColorSelect } from '@/lib/analytics';

export default function ColorPicker({ settings, blocks }) {
  const colors = (blocks || []).filter((b) => b.type === 'color-swatch');
  const [selected, setSelected] = useState(0);
  const bgColor = settings.bgColor || '';
  const current = colors[selected]?.settings || {};

  if (colors.length === 0) return null;

  return (
    <section className="font-body" style={{ backgroundColor: bgColor || undefined, padding: '4rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2.5rem' }}>
        <div className="cp-layout" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Left — large preview */}
          <div style={{ flex: '0 0 45%', maxWidth: '45%' }}>
            <div style={{
              width: '100%', aspectRatio: '3/4', borderRadius: '4px', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              {current.image ? (
                <img
                  src={current.image}
                  alt={current.name || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  backgroundColor: current.hex || '#ccc',
                }} />
              )}
            </div>
          </div>

          {/* Right — title + description + color grid */}
          <div style={{ flex: '1 1 55%' }}>
            {(settings.title || settings.description) && (
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
                  <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, lineHeight: 1.3 }}>
                    {settings.title}
                  </h2>
                )}
                {settings.description && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9375rem', lineHeight: 1.7, color: '#6B5D4E' }}>
                    {settings.description}
                  </p>
                )}
              </div>
            )}

            <div className="cp-grid" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${settings.columns || '3'}, 1fr)`,
              gap: '1rem',
            }}>
              {colors.map((c, i) => {
                const s = c.settings;
                const isActive = i === selected;
                return (
                  <button
                    key={i}
                    onClick={() => { setSelected(i); trackColorSelect(c.settings.name, c.settings.hex); }}
                    style={{
                      padding: 0, border: 'none', cursor: 'pointer',
                      background: 'none', textAlign: 'center',
                    }}
                  >
                    <div style={{
                      aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden',
                      border: isActive ? '2px solid #C4A882' : '2px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(196,168,130,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    }}>
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name || ''}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          backgroundColor: s.hex || '#ccc',
                        }} />
                      )}
                    </div>
                    <span className="font-body" style={{
                      display: 'block', marginTop: '0.35rem',
                      fontSize: '0.6875rem', color: isActive ? '#1A1714' : '#8B7D6B',
                      fontWeight: isActive ? 600 : 400, transition: 'color 0.2s',
                    }}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .cp-layout {
            flex-direction: column !important;
          }
          .cp-layout > div {
            flex: 1 1 100% !important;
            max-width: 100% !important;
          }
          .cp-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
