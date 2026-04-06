export default function StatsBar({ settings, blocks }) {
  const stats = (blocks || []).filter((b) => b.type === 'stat-item');
  const bgColor = settings.bgColor || '#9B997B';

  if (stats.length === 0) return null;

  const iconMap = {
    building: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
        <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  };

  return (
    <section style={{ backgroundColor: bgColor, position: 'relative', overflow: 'hidden', padding: '5rem 0' }}>
      {/* Decorative SVG — large circle outline top-right */}
      <svg
        style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', opacity: 0.08 }}
        viewBox="0 0 360 360" fill="none"
      >
        <circle cx="180" cy="180" r="170" stroke="white" strokeWidth="2" />
        <circle cx="180" cy="180" r="120" stroke="white" strokeWidth="1" />
      </svg>

      {/* Decorative SVG — dot grid bottom-left */}
      <svg
        style={{ position: 'absolute', bottom: '20px', left: '30px', opacity: 0.1 }}
        width="100" height="100" viewBox="0 0 100 100"
      >
        {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
          <circle key={`${r}-${c}`} cx={10 + c * 20} cy={10 + r * 20} r="3" fill="white" />
        )))}
      </svg>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {settings.overline && (
          <p style={{
            textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem',
          }}>
            {settings.overline}
          </p>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: '2.5rem',
          textAlign: 'center',
        }}>
          {stats.map((block, i) => {
            const s = block.settings;
            const Icon = iconMap[s.icon];
            return (
              <div key={i}>
                {Icon && (
                  <div style={{ width: '40px', height: '40px', margin: '0 auto 1rem', color: 'rgba(255,255,255,0.85)' }}>
                    {Icon}
                  </div>
                )}
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>
                  {s.number}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.03em' }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
