import { useState, useRef, useCallback, useEffect } from 'react';
import useReveal from '@/hooks/useReveal';

function ProductCardImages({ images, name, color, isHovered }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      // First slide happens quickly, then normal interval
      const firstTimeout = setTimeout(() => {
        setActiveIndex(1);
        intervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % images.length);
        }, 2500);
      }, 600);
      return () => {
        clearTimeout(firstTimeout);
        clearInterval(intervalRef.current);
      };
    } else {
      clearInterval(intervalRef.current);
      setActiveIndex(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${color} transition-transform duration-700 group-hover:scale-105`} />
    );
  }

  return (
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <img
          key={i}
          src={img.url || img}
          alt={name}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ block, settings }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);
  const p = block.settings;

  // Detect mobile (no hover support)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-play on mobile when card is visible in viewport
  useEffect(() => {
    if (!isMobile || !cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const images = p.images && p.images.length > 0
    ? p.images
    : p.image
      ? [{ url: p.image }]
      : [];
  const hasImages = images.length > 0;
  const shouldSlide = isMobile ? isVisible : isHovered;
  const Tag = p.href ? 'a' : 'div';
  const linkProps = p.href ? { href: p.href } : {};

  return (
    <Tag
      ref={cardRef}
      {...linkProps}
      className={`group relative aspect-[4/5] overflow-hidden ${p.href ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ProductCardImages images={images} name={p.name} color={p.color} isHovered={shouldSlide} />

      {/* Dark overlay for text readability on images */}
      {hasImages && <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-8">
        <div>
          <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/60">
            {p.specs}
          </span>
        </div>

        <div>
          <h3 className="font-display text-2xl lg:text-3xl text-white leading-tight">
            {p.name}
          </h3>
          <p className="mt-3 font-body text-sm text-white/70 leading-relaxed max-w-[280px]">
            {p.desc}
          </p>
          <div className="mt-5 flex items-center gap-2 font-body text-xs tracking-widest uppercase text-sandstone">
            <span>{settings.cardLinkLabel}</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500" />
    </Tag>
  );
}

export default function Collections({ id, settings, blocks }) {
  const sectionRef = useReveal();

  const products = blocks.filter((b) => b.type === 'product-card');

  return (
    <section id={id} className="py-24 lg:py-36 relative" style={{ backgroundColor: settings.bgColor || '#F0EFE9' }} ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal mb-16 lg:mb-24">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">{settings.overline}</span>
          {settings.titleLink ? (
            <a href={settings.titleLink} className="block mt-4 group/title">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1] group-hover/title:underline decoration-1 underline-offset-8">
                {settings.title}
              </h2>
            </a>
          ) : (
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
              {settings.title}
            </h2>
          )}
          <p className="mt-6 font-body text-warm-500 max-w-xl leading-relaxed">
            {settings.description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((block, index) => (
            <ProductCard key={block.settings.name || index} block={block} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  );
}
