export default function ServiceProcess({ settings, blocks }) {
  const steps = (blocks || []).filter((b) => b.type === 'process-step');
  const bgColor = settings.bgColor || '#F5F0EB';

  return (
    <section className="font-body" style={{ backgroundColor: bgColor, padding: '5rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
          {settings.overline && (
            <span style={{
              display: 'block', fontSize: '0.75rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#C4A882', marginBottom: '0.75rem',
            }}>
              {settings.overline}
            </span>
          )}
          {settings.title && (
            <h2 className="font-display" style={{
              fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.3, margin: 0,
            }}>
              {settings.title}
              {settings.titleAccent && (
                <span style={{ fontStyle: 'italic', color: '#C4A882' }}> {settings.titleAccent}</span>
              )}
            </h2>
          )}
          {settings.description && (
            <p style={{
              marginTop: '1rem', fontSize: '0.9375rem', lineHeight: 1.8,
              color: '#6B5D4E',
            }}>
              {settings.description}
            </p>
          )}
        </div>

        {/* Process Steps */}
        {steps.length > 0 && (
          <div className="sp-steps" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, 1fr)`,
            gap: '1.5rem',
            marginBottom: settings.ctaLabel ? '3rem' : 0,
          }}>
            {steps.map((step, i) => {
              const s = step.settings;
              return (
                <div key={i} className="sp-card" style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '6px',
                  border: '1px solid rgba(196,168,130,0.15)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  {/* Step image */}
                  {s.image && (
                    <div style={{
                      width: '100%', aspectRatio: '4/3', overflow: 'hidden',
                      backgroundColor: '#E8E0D6',
                    }}>
                      <img
                        src={s.image}
                        alt={s.title || ''}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                        }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Step content */}
                  <div style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#C4A882', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 0.75rem', fontSize: '0.875rem', fontWeight: 600,
                    }}>
                      {s.stepNumber || (i + 1).toString().padStart(2, '0')}
                    </div>
                    {s.title && (
                      <h3 className="font-display" style={{
                        fontSize: '1.125rem', fontWeight: 500, margin: '0 0 0.5rem',
                        color: '#1A1714',
                      }}>
                        {s.title}
                      </h3>
                    )}
                    {s.description && (
                      <p style={{
                        fontSize: '0.8125rem', lineHeight: 1.7, color: '#6B5D4E', margin: 0,
                      }}>
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feature Image */}
        {settings.imageUrl && (
          <div style={{
            borderRadius: '6px', overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            marginBottom: settings.ctaLabel ? '2.5rem' : 0,
          }}>
            <img
              src={settings.imageUrl}
              alt={settings.imageAlt || ''}
              style={{
                width: '100%', display: 'block',
                maxHeight: '500px', objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* CTA */}
        {settings.ctaLabel && (
          <div style={{ textAlign: 'center' }}>
            <a
              href={settings.ctaHref || '#'}
              className="font-display"
              style={{
                display: 'inline-block', padding: '0.875rem 2.5rem',
                backgroundColor: '#1A1714', color: '#fff',
                textDecoration: 'none', fontSize: '0.875rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                borderRadius: '2px',
                transition: 'background-color 0.2s',
              }}
            >
              {settings.ctaLabel}
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .sp-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        @media (max-width: 768px) {
          .sp-steps {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .sp-steps {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
