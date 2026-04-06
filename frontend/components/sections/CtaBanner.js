export default function CtaBanner({ settings }) {
  const bgColor = settings.bgColor || '#EDF0E4';

  return (
    <section style={{ backgroundColor: bgColor, position: 'relative', overflow: 'hidden' }}>
      {/* SVG wave divider at top */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: '-1px', left: 0, width: '100%', height: '80px' }}
        fill={bgColor}
      >
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" />
      </svg>

      <div className="cta-banner-inner" style={{
        maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem',
        display: 'flex', alignItems: 'center', gap: '4rem',
      }}>
        {/* Left — text + button */}
        <div style={{ flex: '1 1 55%' }}>
          {settings.overline && (
            <p className="font-body" style={{
              fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#9B997B', marginBottom: '1rem',
            }}>
              {settings.overline}
            </p>
          )}
          {settings.title && (
            <h2 className="font-display" style={{
              fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem',
            }}>
              {settings.title}
            </h2>
          )}
          {settings.subtitle && (
            <p className="font-body" style={{
              fontSize: '1rem', lineHeight: 1.7, color: '#5E5C4D',
              marginBottom: '2rem', maxWidth: '480px',
            }}>
              {settings.subtitle}
            </p>
          )}
          {settings.ctaLabel && (
            <a
              href={settings.ctaHref || '#'}
              className="font-body"
              style={{
                display: 'inline-block', padding: '0.875rem 2.5rem',
                backgroundColor: '#9B997B', color: '#fff',
                textDecoration: 'none', fontSize: '0.8rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderRadius: '3px', transition: 'background-color 0.2s',
              }}
            >
              {settings.ctaLabel}
            </a>
          )}

          {/* Decorative dotted arc */}
          <svg
            width="80" height="40" viewBox="0 0 80 40"
            style={{ display: 'block', marginTop: '2rem', opacity: 0.3 }}
            fill="none" stroke="#9B997B" strokeWidth="2" strokeDasharray="4 4"
          >
            <path d="M5 35 C20 5, 60 5, 75 35" />
          </svg>
        </div>

        {/* Right — image */}
        {settings.imageUrl && (
          <div style={{ flex: '0 0 40%', maxWidth: '40%' }}>
            <img
              src={settings.imageUrl}
              alt={settings.imageAlt || ''}
              style={{
                width: '100%', borderRadius: '12px',
                boxShadow: '0 16px 48px rgba(26,26,23,0.12)',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .cta-banner-inner {
            flex-direction: column !important;
            text-align: center;
          }
          .cta-banner-inner > div {
            flex: 1 1 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
