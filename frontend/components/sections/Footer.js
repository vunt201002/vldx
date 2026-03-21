export default function Footer({ settings, blocks }) {
  const bgColor = settings.bgColor || '';
  const textColor = settings.textColor || '';
  const logoUrl = settings.logoUrl || '';
  const logoMaxWidth = settings.logoMaxWidth ? `${settings.logoMaxWidth}px` : '180px';
  const infoLines = (blocks || []).filter((b) => b.type === 'footer-line');
  const socialLinks = (blocks || []).filter((b) => b.type === 'footer-social');

  return (
    <footer
      className="font-body"
      style={{
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
        padding: '4rem 2.5rem 3rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Top: logo + info lines */}
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
          className="footer-top"
        >
          {/* Logo */}
          {logoUrl && (
            <div style={{ flexShrink: 0 }}>
              <img
                src={logoUrl}
                alt={settings.brandName || ''}
                style={{ maxWidth: logoMaxWidth, height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {/* Info lines */}
          {infoLines.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{
                borderTop: '1px solid currentColor',
                opacity: 0.3,
                marginBottom: '1.5rem',
              }} />
              {infoLines.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: settings.fontSize || '0.9rem',
                    lineHeight: 1.8,
                    margin: 0,
                    marginBottom: i < infoLines.length - 1 ? '0.75rem' : 0,
                  }}
                >
                  {line.settings.text}
                </p>
              ))}
              <div style={{
                borderTop: '1px solid currentColor',
                opacity: 0.3,
                marginTop: '1.5rem',
              }} />
            </div>
          )}
        </div>

        {/* Social icons */}
        {socialLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.25rem',
              marginTop: '2.5rem',
            }}
          >
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.settings.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: textColor || 'inherit',
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                aria-label={link.settings.label}
                dangerouslySetInnerHTML={{ __html: getSocialIcon(link.settings.icon || link.settings.label) }}
              />
            ))}
          </div>
        )}

        {/* Copyright */}
        {settings.copyright && (
          <p style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            opacity: 0.5,
            marginTop: '2rem',
          }}>
            {settings.copyright}
          </p>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}

function getSocialIcon(name) {
  const n = (name || '').toLowerCase();
  const icons = {
    email: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 8 10-8"/></svg>',
    instagram: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>',
    facebook: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    linkedin: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    pinterest: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.96s-.36-.72-.36-1.78c0-1.66.97-2.9 2.17-2.9 1.02 0 1.52.77 1.52 1.7 0 1.03-.66 2.58-1 4.01-.28 1.2.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.13.89 2.73.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.91-7.25 4.15 0 7.38 2.96 7.38 6.92 0 4.12-2.6 7.44-6.21 7.44-1.21 0-2.35-.63-2.74-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.15A12 12 0 1 0 12 0z"/></svg>',
    tiktok: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.3 0 .59.04.86.12V8.95a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.37a8.16 8.16 0 0 0 4.78 1.53V7.44a4.85 4.85 0 0 1-1.02-.75z"/></svg>',
    zalo: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.84 1.47 5.37 3.76 7.04L5 22l3.72-2.04c1.05.34 2.15.54 3.28.54 5.52 0 10-4.03 10-9S17.52 2 12 2zm-1.5 12.5H7v-1h3.5v1zm5-3H7v-1h8.5v1zm0-2.5H7V8h8.5v1z"/></svg>',
  };
  return icons[n] || `<span style="font-size:0.875rem">${name}</span>`;
}
