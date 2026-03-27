import { useRef, useState, useEffect } from 'react';

export default function Hero({ settings }) {
  const imageUrl = settings.imageUrl;
  const imgRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(0);

  useEffect(() => {
    if (!imgRef.current) return;
    const updateHeight = () => setHeroHeight(imgRef.current.offsetHeight);
    imgRef.current.addEventListener('load', updateHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  const maxHeight = settings.imageMaxHeight || undefined;

  return (
    <>
      {/* Fixed hero image */}
      <section
        className="hero-sticky"
        style={maxHeight ? { maxHeight, overflow: 'hidden' } : undefined}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt={settings.imageAlt || ''}
          style={maxHeight ? { objectFit: 'cover', width: '100%', height: maxHeight } : { width: '100%' }}
        />
      </section>
      {/* Spacer to push content below the fixed hero */}
      <div style={{ height: maxHeight || heroHeight || 'auto' }} />
    </>
  );
}
