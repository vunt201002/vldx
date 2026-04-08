export default function ContentImage({ settings, blocks }) {
  const buttons = (blocks || []).filter((b) => b.type === 'content-button');

  // Resolve square images: prefer gallery array, fall back to legacy single image
  const squareImages = settings.squareImages?.length > 0
    ? settings.squareImages
    : settings.squareImageUrl
      ? [{ url: settings.squareImageUrl, alt: settings.squareImageAlt || '' }]
      : [];

  if (
    squareImages.length === 0 &&
    !settings.rectImageUrl &&
    !settings.title &&
    !settings.description &&
    buttons.length === 0
  ) {
    return null;
  }

  // squarePosition: 'left' | 'right'   — which side the square image sits on
  // rectImageOrder: 'top'  | 'bottom'  — where the rect image sits inside its column
  const squarePosition = settings.squarePosition || 'left';
  const rectImageOrder = settings.rectImageOrder || 'top';

  const bgColor       = settings.bgColor || '';
  const maxWidth      = settings.maxWidth || '1200px';
  const padding       = settings.sectionPadding || '5rem 0';
  const titleSize     = settings.titleSize || '2rem';
  const titleColor    = settings.titleColor || '';
  const descSize      = settings.descSize || '1rem';
  const descColor     = settings.descColor || '';

  const squareOnRight = squarePosition === 'right';
  const rectImgOnTop  = rectImageOrder === 'top';

  // ── Rect column: rectangle image + short text ──────────────────
  const rectCol = (
    <div className="ci-rect-col">
      {rectImgOnTop && settings.rectImageUrl && (
        <div className="ci-rect-wrap">
          <img
            src={settings.rectImageUrl}
            alt={settings.rectImageAlt || ''}
            className="ci-rect-img"
          />
        </div>
      )}

      <div className="ci-text">
        {settings.overline && (
          <p className="ci-overline font-body">{settings.overline}</p>
        )}
        {settings.title && (
          <h2
            className="ci-title font-display"
            style={{ fontSize: titleSize, color: titleColor || undefined }}
          >
            {settings.title}
            {settings.titleAccent && <> <em>{settings.titleAccent}</em></>}
          </h2>
        )}
        {settings.description && (
          <p
            className="ci-desc font-body"
            style={{ fontSize: descSize, color: descColor || undefined }}
          >
            {settings.description}
          </p>
        )}
      </div>

      {!rectImgOnTop && settings.rectImageUrl && (
        <div className="ci-rect-wrap">
          <img
            src={settings.rectImageUrl}
            alt={settings.rectImageAlt || ''}
            className="ci-rect-img"
          />
        </div>
      )}
    </div>
  );

  // ── Square column: image gallery (1-6 images) ──────────────────
  const count = Math.min(squareImages.length, 6);

  // Grid columns: max 3 per row
  const cols = Math.min(count, 3);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '0.5rem',
    width: '100%',
  };

  // For 4 images: last item spans full width
  const cellStyle = (i) => {
    const base = { overflow: 'hidden', borderRadius: '4px', aspectRatio: '1 / 1' };
    if (count === 4 && i === 3) return { ...base, gridColumn: '1 / -1', aspectRatio: '3 / 1' };
    if (count === 5 && i >= 3) return { ...base, gridColumn: 'span 3', aspectRatio: '3 / 2' };
    if (count === 5 && i < 3) return { ...base, gridColumn: 'span 2' };
    return base;
  };

  // For 5 images: use 6-column base grid
  const gridColumns = count === 5 ? 'repeat(6, 1fr)' : `repeat(${cols}, 1fr)`;

  const squareCol = (
    <div
      className={`ci-square-col${count > 1 ? ' ci-square-col--wide' : ''}`}
    >
      {count > 0 && (
        <div style={{ ...gridStyle, gridTemplateColumns: gridColumns }}>
          {squareImages.slice(0, 6).map((img, i) => (
            <div key={i} style={cellStyle(i)}>
              <img
                src={img.url}
                alt={img.alt || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading={i > 0 ? 'lazy' : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section
      className="ci-section"
      style={{ backgroundColor: bgColor || undefined, padding }}
    >
      <div className="ci-container" style={{ maxWidth }}>
        {/*
          DOM order: rect-col first, square-col second.
          On desktop we use flex-direction: row (square right) or row-reverse (square left).
          On mobile the column order is always: rect-col on top, square-col below.
        */}
        <div className={`ci-row${squareOnRight ? '' : ' ci-row--square-left'}`}>
          {rectCol}
          {squareCol}
        </div>

        {buttons.length > 0 && (
          <div className="ci-buttons">
            {buttons.map((btn, i) => (
              <a
                key={i}
                href={btn.settings.href || '#'}
                className="ci-btn font-body"
                style={{
                  color: btn.settings.color || 'inherit',
                  borderColor: btn.settings.borderColor || btn.settings.color || 'currentColor',
                }}
              >
                {btn.settings.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        /* ─── Container ────────────────────────── */
        .ci-container {
          margin: 0 auto;
          padding: 0 1.25rem;
        }

        /* ─── Row — mobile: single column ──────── */
        .ci-row {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ─── Square column ─────────────────────── */
        .ci-square-col {
          width: 100%;
          overflow: hidden;
          flex-shrink: 0;
        }
        /* Grid styles are inline (style jsx can't scope .map() children) */

        /* ─── Rect column ───────────────────────── */
        .ci-rect-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
          min-width: 0;
        }
        .ci-rect-wrap {
          width: 100%;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          flex-shrink: 0;
        }
        .ci-rect-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ─── Text ──────────────────────────────── */
        .ci-overline {
          margin: 0 0 0.5rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.55;
        }
        .ci-title {
          margin: 0 0 1rem;
          font-weight: 400;
          line-height: 1.15;
        }
        .ci-title em {
          font-style: italic;
          opacity: 0.65;
        }
        .ci-desc {
          margin: 0;
          line-height: 1.75;
        }
        .ci-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .ci-btn {
          display: inline-block;
          padding: 0.65rem 1.6rem;
          background: transparent;
          border: 1px solid currentColor;
          font-size: 0.8125rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ci-btn:hover {
          opacity: 0.6;
        }

        /* ─── Tablet 640 px ─────────────────────── */
        @media (min-width: 640px) {
          .ci-container {
            padding: 0 2rem;
          }
          .ci-row {
            flex-direction: row;        /* rect-col left, square-col right */
            align-items: center;
            gap: 2.5rem;
          }
          .ci-row--square-left {
            flex-direction: row-reverse; /* square-col left, rect-col right */
          }
          .ci-square-col {
            flex: 0 0 36%;
            max-width: 36%;
          }
          :global(.ci-square-col--wide) {
            flex: 0 0 42%;
            max-width: 42%;
          }
        }

        /* ─── Desktop 1024 px ───────────────────── */
        @media (min-width: 1024px) {
          .ci-container {
            padding: 0 2.5rem;
          }
          .ci-row {
            gap: 3.5rem;
            align-items: flex-start;
          }
          .ci-square-col {
            flex: 0 0 38%;
            max-width: 38%;
          }
          :global(.ci-square-col--wide) {
            flex: 0 0 42%;
            max-width: 42%;
          }
        }
      `}</style>
    </section>
  );
}
