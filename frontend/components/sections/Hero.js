export default function Hero({ settings }) {
  const imageUrl = settings.imageUrl;

  if (!imageUrl) {
    return null;
  }

  const maxHeight = settings.imageMaxHeight || '600px';

  return (
    <section className="w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={settings.imageAlt || ''}
        className="w-full object-cover"
        style={{ maxHeight }}
      />
    </section>
  );
}
