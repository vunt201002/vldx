export default function ContentImage({ settings, blocks }) {
  const buttons = (blocks || []).filter((b) => b.type === 'content-button');

  // Gallery side images (1-6)
  const galleryImages = settings.images?.length > 0
    ? settings.images.slice(0, 6)
    : [];

  // Content side image
  const contentImageUrl = settings.contentImageUrl || '';
  const contentImageAlt = settings.contentImageAlt || '';

  // Backward compat: old squareImageUrl/rectImageUrl
  const isLegacy = galleryImages.length === 0 && !contentImageUrl
    && (settings.squareImageUrl || settings.rectImageUrl);

  if (
    !isLegacy &&
    galleryImages.length === 0 &&
    !contentImageUrl &&
    !settings.title &&
    !settings.description &&
    buttons.length === 0
  ) {
    return null;
  }

  const galleryOnRight = (settings.squarePosition || 'left') === 'right';
  const rectImgOnTop = (settings.rectImageOrder || 'top') === 'top';
  const galleryLayout = settings.galleryLayout || 'featured';
  const bgColor   = settings.bgColor || '';
  const maxWidth  = settings.maxWidth || '1200px';
  const padding   = settings.sectionPadding || '5rem 0';
  const titleSize = settings.titleSize || '2rem';
  const titleColor = settings.titleColor || '';
  const descSize  = settings.descSize || '1rem';
  const descColor = settings.descColor || '';

  // ── Legacy layout (old squareImageUrl + rectImageUrl) ──────
  if (isLegacy) {
    const rectCol = (
      <div className="ci-content-col">
        {rectImgOnTop && settings.rectImageUrl && (
          <div className="ci-rect-wrap">
            <img src={settings.rectImageUrl} alt={settings.rectImageAlt || ''} className="ci-rect-img" />
          </div>
        )}
        <div className="ci-text">
          {settings.overline && <p className="ci-overline font-body">{settings.overline}</p>}
          {settings.title && (
            <h2 className="ci-title font-display" style={{ fontSize: titleSize, color: titleColor || undefined }}>
              {settings.title}
              {settings.titleAccent && <> <em>{settings.titleAccent}</em></>}
            </h2>
          )}
          {settings.description && (
            <p className="ci-desc font-body" style={{ fontSize: descSize, color: descColor || undefined }}>
              {settings.description}
            </p>
          )}
        </div>
        {!rectImgOnTop && settings.rectImageUrl && (
          <div className="ci-rect-wrap">
            <img src={settings.rectImageUrl} alt={settings.rectImageAlt || ''} className="ci-rect-img" />
          </div>
        )}
      </div>
    );

    const squareCol = (
      <div className="ci-gallery-col">
        {settings.squareImageUrl && (
          <div className="ci-gallery" data-count="1">
            <div className="ci-gallery-item ci-gallery-item--square">
              <img src={settings.squareImageUrl} alt={settings.squareImageAlt || ''} className="ci-gallery-img" />
            </div>
          </div>
        )}
      </div>
    );

    return (
      <section className="ci-section" style={{ backgroundColor: bgColor || undefined, padding }}>
        <div className="ci-container" style={{ maxWidth }}>
          <div className={`ci-row${galleryOnRight ? '' : ' ci-row--reverse'}`}>
            {rectCol}
            {squareCol}
          </div>
          {buttons.length > 0 && (
            <div className="ci-buttons">
              {buttons.map((btn, i) => (
                <a key={i} href={btn.settings.href || '#'} className="ci-btn font-body"
                  style={{ color: btn.settings.color || 'inherit', borderColor: btn.settings.borderColor || btn.settings.color || 'currentColor' }}>
                  {btn.settings.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {sharedStyles}
      </section>
    );
  }

  // ── New layout ─────────────────────────────────────────────
  const galleryCount = galleryImages.length;
  const galleryClass = galleryCount >= 5 && galleryLayout === 'grid'
    ? `ci-gallery ci-gallery--grid`
    : `ci-gallery`;

  // Content side: rect image (top or bottom) + text
  const contentCol = (
    <div className="ci-content-col">
      {rectImgOnTop && contentImageUrl && (
        <div className="ci-rect-wrap">
          <img src={contentImageUrl} alt={contentImageAlt} className="ci-rect-img" />
        </div>
      )}
      <div className="ci-text">
        {settings.overline && <p className="ci-overline font-body">{settings.overline}</p>}
        {settings.title && (
          <h2 className="ci-title font-display" style={{ fontSize: titleSize, color: titleColor || undefined }}>
            {settings.title}
            {settings.titleAccent && <> <em>{settings.titleAccent}</em></>}
          </h2>
        )}
        {settings.description && (
          <p className="ci-desc font-body" style={{ fontSize: descSize, color: descColor || undefined }}>
            {settings.description}
          </p>
        )}
      </div>
      {!rectImgOnTop && contentImageUrl && (
        <div className="ci-rect-wrap">
          <img src={contentImageUrl} alt={contentImageAlt} className="ci-rect-img" />
        </div>
      )}
    </div>
  );

  // Gallery side
  const galleryCol = galleryCount > 0 ? (
    <div className="ci-gallery-col">
      <div className={galleryClass} data-count={galleryCount}>
        {galleryImages.map((img, i) => (
          <div key={i} className="ci-gallery-item">
            <img src={img.url} alt={img.alt || ''} className="ci-gallery-img" />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // No gallery images → single column centered
  if (galleryCount === 0) {
    return (
      <section className="ci-section" style={{ backgroundColor: bgColor || undefined, padding }}>
        <div className="ci-container ci-container--single" style={{ maxWidth }}>
          {contentCol}
          {buttons.length > 0 && (
            <div className="ci-buttons">
              {buttons.map((btn, i) => (
                <a key={i} href={btn.settings.href || '#'} className="ci-btn font-body"
                  style={{ color: btn.settings.color || 'inherit', borderColor: btn.settings.borderColor || btn.settings.color || 'currentColor' }}>
                  {btn.settings.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {sharedStyles}
      </section>
    );
  }

  // Two-column: content side + gallery side
  return (
    <section className="ci-section" style={{ backgroundColor: bgColor || undefined, padding }}>
      <div className="ci-container" style={{ maxWidth }}>
        <div className={`ci-row${galleryOnRight ? '' : ' ci-row--reverse'}`}>
          {contentCol}
          {galleryCol}
        </div>
        {buttons.length > 0 && (
          <div className="ci-buttons">
            {buttons.map((btn, i) => (
              <a key={i} href={btn.settings.href || '#'} className="ci-btn font-body"
                style={{ color: btn.settings.color || 'inherit', borderColor: btn.settings.borderColor || btn.settings.color || 'currentColor' }}>
                {btn.settings.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {sharedStyles}
    </section>
  );
}

// ── Shared styles (used by all layout paths) ─────────────────
const sharedStyles = (
  <style jsx>{`
    /* ─── Container ────────────────────────── */
    .ci-container { margin: 0 auto; padding: 0 1.25rem; }
    .ci-container--single { max-width: 640px; }

    /* ─── Row — mobile: single column ──────── */
    .ci-row { display: flex; flex-direction: column; gap: 1.5rem; }
    /* gallery-left: image appears above text on mobile */
    .ci-row--reverse { flex-direction: column-reverse; }

    /* ─── Content column (image + text) ────── */
    .ci-content-col { display: flex; flex-direction: column; gap: 1.25rem; flex: 1; min-width: 0; }
    .ci-rect-wrap { width: 100%; aspect-ratio: 3/2; overflow: hidden; flex-shrink: 0; }
    .ci-rect-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .ci-overline { margin: 0 0 0.5rem; font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.55; }
    .ci-title { margin: 0 0 1rem; font-weight: 400; line-height: 1.15; }
    .ci-title em { font-style: italic; opacity: 0.65; }
    .ci-desc { margin: 0; line-height: 1.75; }

    /* ─── Gallery column ───────────────────── */
    .ci-gallery-col { width: 100%; flex-shrink: 0; }
    .ci-gallery { display: grid; gap: 3px; width: 100%; }
    .ci-gallery-item { overflow: hidden; }
    .ci-gallery-item--square { aspect-ratio: 1/1; }
    .ci-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* 1 image → landscape on mobile, square on tablet+ */
    .ci-gallery[data-count="1"] { grid-template-columns: 1fr; }
    .ci-gallery[data-count="1"] .ci-gallery-item { aspect-ratio: 4/3; }

    /* 2 images → side by side on mobile */
    .ci-gallery[data-count="2"] { grid-template-columns: 1fr 1fr; }
    .ci-gallery[data-count="2"] .ci-gallery-item { aspect-ratio: 1/1; }

    /* 3 images → 1 top + 2 bottom */
    .ci-gallery[data-count="3"] { grid-template-columns: 1fr 1fr; }
    .ci-gallery[data-count="3"] .ci-gallery-item:first-child { grid-column: 1 / -1; aspect-ratio: 16/9; }
    .ci-gallery[data-count="3"] .ci-gallery-item:not(:first-child) { aspect-ratio: 1/1; }

    /* 4 images → 2x2 */
    .ci-gallery[data-count="4"] { grid-template-columns: 1fr 1fr; }
    .ci-gallery[data-count="4"] .ci-gallery-item { aspect-ratio: 1/1; }

    /* 5 images — featured: 1 large left + 2 right + 2 bottom */
    .ci-gallery[data-count="5"]:not(.ci-gallery--grid) { grid-template-columns: 1fr 1fr; }
    .ci-gallery[data-count="5"]:not(.ci-gallery--grid) .ci-gallery-item:first-child { grid-row: 1 / 3; aspect-ratio: auto; }
    .ci-gallery[data-count="5"]:not(.ci-gallery--grid) .ci-gallery-item:not(:first-child) { aspect-ratio: 1/1; }

    /* 5 images — grid: 3 top + 2 bottom */
    .ci-gallery[data-count="5"].ci-gallery--grid { grid-template-columns: 1fr 1fr 1fr; }
    .ci-gallery[data-count="5"].ci-gallery--grid .ci-gallery-item { aspect-ratio: 1/1; }

    /* 6 images — featured: 1 large left + 2 right + 3 bottom */
    .ci-gallery[data-count="6"]:not(.ci-gallery--grid) { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; }
    .ci-gallery[data-count="6"]:not(.ci-gallery--grid) .ci-gallery-item:nth-child(1) { grid-row: 1 / 3; }

    /* 6 images — grid: 3x2 */
    .ci-gallery[data-count="6"].ci-gallery--grid { grid-template-columns: 1fr 1fr 1fr; }
    .ci-gallery[data-count="6"].ci-gallery--grid .ci-gallery-item { aspect-ratio: 1/1; }

    /* ─── Buttons ──────────────────────────── */
    .ci-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 2rem; }
    .ci-btn { display: inline-block; padding: 0.65rem 1.6rem; background: transparent; border: 1px solid currentColor; font-size: 0.8125rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: opacity 0.2s; }
    .ci-btn:hover { opacity: 0.6; }

    /* ─── Tablet 640px ─────────────────────── */
    @media (min-width: 640px) {
      .ci-container { padding: 0 2rem; }
      .ci-row { flex-direction: row; align-items: center; gap: 2.5rem; }
      .ci-row--reverse { flex-direction: row-reverse; }
      .ci-gallery-col { flex: 0 0 38%; max-width: 38%; }
      .ci-gallery-item { transition: transform 0.3s ease; }
      .ci-gallery-item:hover { transform: scale(1.02); }
      /* restore square for 1 image on tablet+ */
      .ci-gallery[data-count="1"] .ci-gallery-item { aspect-ratio: 1/1; }
    }

    /* ─── Desktop 1024px ───────────────────── */
    @media (min-width: 1024px) {
      .ci-container { padding: 0 2.5rem; }
      .ci-row { gap: 3.5rem; align-items: flex-start; }
      .ci-gallery-col { flex: 0 0 40%; max-width: 40%; }
    }
  `}</style>
);
