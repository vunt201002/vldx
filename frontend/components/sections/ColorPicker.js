import { useState, useEffect } from 'react';
import { trackColorSelect } from '@/lib/analytics';

const ITEMS_PER_PAGE = 6;

export default function ColorPicker({ settings, blocks }) {
  const colors = (blocks || []).filter((b) => b.type === 'color-swatch');
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bgColor = settings.bgColor || '';
  const current = colors[selected]?.settings || {};

  const totalPages = Math.ceil(colors.length / ITEMS_PER_PAGE);
  const pagedColors = colors.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [showModal]);

  if (colors.length === 0) return null;

  const handleSelect = (globalIndex) => {
    const c = colors[globalIndex];
    setSelected(globalIndex);
    trackColorSelect(c.settings.name, c.settings.hex);
    if (isMobile) setShowModal(true);
  };

  return (
    <section className="font-body" style={{ backgroundColor: bgColor || undefined, padding: '4rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2.5rem' }}>
        <div className="cp-layout" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Left — large preview (hidden on mobile via CSS) */}
          <div className="cp-preview" style={{ flex: '0 0 45%', maxWidth: '45%' }}>
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

          {/* Right — title + description + color grid + pagination */}
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
              gap: '1.25rem',
            }}>
              {pagedColors.map((c, i) => {
                const s = c.settings;
                const globalIndex = page * ITEMS_PER_PAGE + i;
                const isActive = globalIndex === selected;
                return (
                  <button
                    key={globalIndex}
                    onClick={() => handleSelect(globalIndex)}
                    style={{
                      padding: 0, border: 'none', cursor: 'pointer',
                      background: 'none', textAlign: 'center',
                    }}
                  >
                    <div style={{
                      aspectRatio: '1/1', maxWidth: '120px', margin: '0 auto',
                      borderRadius: '4px', overflow: 'hidden',
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
                      display: 'block', marginTop: '0.5rem',
                      fontSize: '0.8125rem', color: isActive ? '#1A1714' : '#8B7D6B',
                      fontWeight: isActive ? 600 : 400, transition: 'color 0.2s',
                    }}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '1rem', marginTop: '1.5rem',
              }}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="font-body"
                  style={{
                    padding: '0.4rem 1rem', fontSize: '0.8125rem',
                    border: '1px solid #C4A882', borderRadius: '4px',
                    background: page === 0 ? '#F5F0EB' : '#fff',
                    color: page === 0 ? '#C4B9A8' : '#6B5D4E',
                    cursor: page === 0 ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  &#8592;
                </button>
                <span className="font-body" style={{ fontSize: '0.8125rem', color: '#6B5D4E' }}>
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="font-body"
                  style={{
                    padding: '0.4rem 1rem', fontSize: '0.8125rem',
                    border: '1px solid #C4A882', borderRadius: '4px',
                    background: page === totalPages - 1 ? '#F5F0EB' : '#fff',
                    color: page === totalPages - 1 ? '#C4B9A8' : '#6B5D4E',
                    cursor: page === totalPages - 1 ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile preview modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', width: '100%', maxWidth: '400px',
              borderRadius: '8px', overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: '0.75rem', right: '0.75rem',
                zIndex: 1, width: '32px', height: '32px',
                borderRadius: '50%', border: 'none',
                backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff',
                cursor: 'pointer', fontSize: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              &times;
            </button>
            <div style={{ aspectRatio: '3/4' }}>
              {current.image ? (
                <img
                  src={current.image}
                  alt={current.name || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: current.hex || '#ccc' }} />
              )}
            </div>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <span className="font-body" style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1A1714' }}>
                {current.name}
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .cp-layout {
            flex-direction: column !important;
          }
          .cp-layout > div {
            flex: 1 1 100% !important;
            max-width: 100% !important;
          }
          .cp-preview {
            display: none !important;
          }
          .cp-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
