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
  const count = squareImages.length;
  const squareCol = (
    <div className="ci-square-col">
      {count > 0 && (
        <div className={`ci-grid ci-grid--${Math.min(count, 6)}`}>
          {squareImages.slice(0, 6).map((img, i) => (
            <div key={i} className="ci-grid-cell">
              <img
                src={img.url}
                alt={img.alt || ''}
                className="ci-grid-img"
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
          max-width: 320px;
          overflow: hidden;
          flex-shrink: 0;
        }

        /* ─── Image grid ───────────────────────── */
        .ci-grid {
          display: grid;
          gap: 0.5rem;
          width: 100%;
        }
        .ci-grid-cell {
          overflow: hidden;
          border-radius: 4px;
        }
        .ci-grid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* 1 image: full width, square */
        .ci-grid--1 { grid-template-columns: 1fr; }
        .ci-grid--1 .ci-grid-cell { aspect-ratio: 1 / 1; }

        /* 2 images: side by side */
        .ci-grid--2 { grid-template-columns: 1fr 1fr; }
        .ci-grid--2 .ci-grid-cell { aspect-ratio: 1 / 1; }

        /* 3 images: 3 columns */
        .ci-grid--3 { grid-template-columns: 1fr 1fr 1fr; }
        .ci-grid--3 .ci-grid-cell { aspect-ratio: 1 / 1; }

        /* 4 images: row 1 = 3 cols, row 2 = 1 full-width */
        .ci-grid--4 { grid-template-columns: 1fr 1fr 1fr; }
        .ci-grid--4 .ci-grid-cell { aspect-ratio: 1 / 1; }
        .ci-grid--4 .ci-grid-cell:nth-child(4) {
          grid-column: 1 / -1;
          aspect-ratio: 3 / 1;
        }

        /* 5 images: row 1 = 3 cols, row 2 = 2 cols (6-col base grid) */
        .ci-grid--5 { grid-template-columns: repeat(6, 1fr); }
        .ci-grid--5 .ci-grid-cell:nth-child(-n+3) {
          grid-column: span 2;
          aspect-ratio: 1 / 1;
        }
        .ci-grid--5 .ci-grid-cell:nth-child(n+4) {
          grid-column: span 3;
          aspect-ratio: 3 / 2;
        }

        /* 6 images: 2 rows of 3 */
        .ci-grid--6 { grid-template-columns: 1fr 1fr 1fr; }
        .ci-grid--6 .ci-grid-cell { aspect-ratio: 1 / 1; }

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
        }
      `}</style>
    </section>
  );
}
