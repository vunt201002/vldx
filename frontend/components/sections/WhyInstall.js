export default function WhyInstall({ settings }) {
  const bgColor = settings.bgColor || '#fff';

  return (
    <section style={{ backgroundColor: bgColor, padding: '6rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '5rem', alignItems: 'center' }}
        className="wi-row"
      >
        {/* Left — image with decorative blob */}
        <div className="wi-visual" style={{ flex: '0 0 45%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Blob SVG behind image */}
          <svg
            viewBox="0 0 420 420"
            style={{ position: 'absolute', width: '110%', height: '110%', top: '50%', left: '50%', transform: 'translate(-55%, -50%)', zIndex: 0 }}
            fill="none"
          >
            <circle cx="210" cy="210" r="200" fill="#C8CCB6" opacity="0.25" />
            <circle cx="210" cy="210" r="160" fill="#C8CCB6" opacity="0.12" />
          </svg>
          {settings.imageUrl && (
            <img
              src={settings.imageUrl}
              alt={settings.imageAlt || ''}
              style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: '400px', height: '480px',
                objectFit: 'cover', borderRadius: '16px',
                boxShadow: '0 24px 60px rgba(26,26,23,0.15)',
              }}
            />
          )}
        </div>

        {/* Right — text + icon cards */}
        <div style={{ flex: '1 1 55%' }}>
          {settings.overline && (
            <p className="font-body" style={{
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#9B997B', marginBottom: '1rem',
            }}>
              {settings.overline}
            </p>
          )}
          {settings.title && (
            <h2 className="font-display" style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem' }}>
              {settings.title}
            </h2>
          )}
          {settings.description && (
            <p className="font-body" style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#5E5C4D', marginBottom: '2rem' }}>
              {settings.description}
            </p>
          )}

          {/* 3 icon cards */}
          <div style={{ display: 'flex', gap: '1rem' }} className="wi-cards">
            <div style={cardStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9B997B" strokeWidth="1.5" style={iconStyle}>
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span style={labelStyle}>{settings.card1Label || 'Do dac chinh xac'}</span>
            </div>
            <div style={cardStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9B997B" strokeWidth="1.5" style={iconStyle}>
                <path d="M3 21h18M5 21V7l8-4 8 4v14" /><path d="M9 21v-6h6v6" />
              </svg>
              <span style={labelStyle}>{settings.card2Label || 'San xuat theo yeu cau'}</span>
            </div>
            <div style={cardStyle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9B997B" strokeWidth="1.5" style={iconStyle}>
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
              <span style={labelStyle}>{settings.card3Label || 'Thi cong chuyen nghiep'}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .wi-row {
            flex-direction: column !important;
            gap: 2.5rem !important;
          }
          .wi-visual {
            flex: 1 1 100% !important;
          }
          .wi-cards {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}

const cardStyle = {
  flex: 1,
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '1rem',
  border: '1px solid #C8CCB6',
  borderRadius: '12px',
  background: '#F5F6F0',
  transition: 'box-shadow 0.2s',
};

const iconStyle = { width: '32px', height: '32px', flexShrink: 0 };

const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#1A1A17', lineHeight: 1.3 };
