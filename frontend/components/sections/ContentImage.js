export default function ContentImage({ settings, blocks }) {
  const buttons = (blocks || []).filter((b) => b.type === 'content-button');

  // Nothing to render — skip entirely to avoid blank whitespace on the page
  if (!settings.title && !settings.description && !settings.imageUrl && buttons.length === 0) {
    return null;
  }

  const reverse = settings.direction === 'image-right';
  const imageWidth = settings.imageWidth || '50';
  const textWidth = 100 - parseInt(imageWidth);
  const titleSize = settings.titleSize || '2rem';
  const descSize = settings.descSize || '1rem';
  const titleColor = settings.titleColor || '';
  const descColor = settings.descColor || '';
  const bgColor = settings.bgColor || '';
  const maxWidth = settings.maxWidth || '1400px';
  const padding = settings.sectionPadding || '4rem 0';
  const mobileContentFirst = settings.mobileOrder === 'content-first';

  // On mobile: image-first = image on top, content-first = content on top
  // We use CSS order to control this without duplicating elements
  const imageOrder = mobileContentFirst ? 'ci-mobile-second' : 'ci-mobile-first';
  const contentOrder = mobileContentFirst ? 'ci-mobile-first' : 'ci-mobile-second';

  return (
    <section style={{ backgroundColor: bgColor || undefined, padding }}>
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          padding: '0 2.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: reverse ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: '3rem',
          }}
          className="ci-inner"
        >
          {/* Image */}
          {settings.imageUrl && (
            <div
              className={`ci-col ${imageOrder}`}
              style={{ flex: `0 0 ${imageWidth}%`, maxWidth: `${imageWidth}%` }}
            >
              <img
                src={settings.imageUrl}
                alt={settings.imageAlt || ''}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {/* Content */}
          <div
            className={`ci-col ${contentOrder}`}
            style={{ flex: `0 0 ${textWidth}%`, maxWidth: `${textWidth}%` }}
          >
            {settings.title && (
              <h2
                className="font-display"
                style={{
                  fontSize: titleSize,
                  color: titleColor || undefined,
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                  fontWeight: 400,
                }}
              >
                {settings.title}
              </h2>
            )}
            {settings.description && (
              <p
                className="font-body"
                style={{
                  fontSize: descSize,
                  color: descColor || undefined,
                  lineHeight: 1.7,
                }}
              >
                {settings.description}
              </p>
            )}
          </div>
        </div>

        {/* Buttons — centered below image + content */}
        {buttons.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            {buttons.map((btn, i) => (
              <a
                key={i}
                href={btn.settings.href || '#'}
                className="font-body"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  border: '1px solid currentColor',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  color: btn.settings.color || descColor || 'inherit',
                  backgroundColor: btn.settings.bgColor || 'transparent',
                  transition: 'opacity 0.2s',
                }}
              >
                {btn.settings.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .ci-inner {
            flex-direction: column !important;
          }
          .ci-col {
            flex: 1 1 100% !important;
            max-width: 100% !important;
          }
          .ci-mobile-first {
            order: 1;
          }
          .ci-mobile-second {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}
