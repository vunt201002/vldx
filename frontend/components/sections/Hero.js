export default function Hero({ settings }) {
  const imageUrl = settings.imageUrl;

  if (!imageUrl) {
    return null;
  }

  const maxHeight = settings.imageMaxHeight || undefined;

  return (
    <section className="hero-full-width" style={maxHeight ? { maxHeight, overflow: 'hidden' } : undefined}>
      <img
        src={imageUrl}
        alt={settings.imageAlt || ''}
        style={maxHeight ? { objectFit: 'cover', height: maxHeight } : undefined}
      />
    </section>
  );
}
