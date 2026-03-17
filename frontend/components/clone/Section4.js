import { useEffect, useRef, useState } from 'react';

/**
 * Section4 — Parallax image gallery strip
 * Cloned from concrete-collaborative.com
 *
 * Original section rect: 1920px wide × 1804px tall (y: 4005)
 * Contains 4 full-bleed parallax image panels stacked vertically:
 *   1. IMG_0012-3.JPG      — 2304×1536 source, rendered at 1920×816px
 *   2. BeigeLeftBanner.jpg — 1500×794  source, rendered at 1920×581px
 *   3. greenhomebanner.png — 1500×794  source, rendered at 1920×871px
 *   4. peachfooter.png     — 1500×457  source, rendered at 1920×1208px (w/ wide crop)
 */

// Original panel heights at 1920px wide
const PANELS = [
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1650916498846-WIN385GTSZOJF38NZB9U/IMG_0012-3.JPG?format=2500w',
    alt: 'IMG_0012-3.JPG',
    // original container 1920×816; image source 2304×1536 (focal ~0.518, 0.860)
    heightRatio: 816 / 1920,   // ~0.425
    // focal point y ≈ 86% from top → position the crop toward bottom
    focalX: 51.79,
    focalY: 86.01,
    // original image rendered 1920×1280 inside container 816px tall — image is taller
    // parallax: image top starts at -332px (negative → image starts above container)
    imageHeightRatio: 1280 / 1920,  // ~0.667
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1712350791472-ITP0ENRPYIJSD69B3LHR/BeigeLeftBanner.jpg?format=2500w',
    alt: 'BeigeLeftBanner.jpg',
    // original container 1920×581; image source 1500×794 → rendered 1920×1016
    heightRatio: 581 / 1920,   // ~0.302
    focalX: 50,
    focalY: 50,
    imageHeightRatio: 1016 / 1920,  // ~0.529
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584988979321-30OHQ0V026TXWD87U7G3/greenhomebanner.png?format=2500w',
    alt: 'greenhomebanner.png',
    // original container 1920×871; image source 1500×794 → rendered 1920×1016
    heightRatio: 871 / 1920,   // ~0.454
    focalX: 50,
    focalY: 50,
    imageHeightRatio: 1016 / 1920,  // ~0.529
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585783532903-CRMIRYQNEEKSRWZ93TMH/peachfooter.png?format=2500w',
    alt: 'peachfooter.png',
    // original container 1920×1208; image source 1500×457 → rendered 3754×1144 (very wide)
    heightRatio: 1208 / 1920,  // ~0.629
    focalX: 50,
    focalY: 50,
    // image is rendered wider than container — crops horizontally
    imageHeightRatio: 1144 / 1920,  // ~0.596
  },
];

function ParallaxPanel({ panel, index }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Progress from when the element enters the bottom of the viewport to
      // when it leaves the top. Range: 0 (fully below) → 1 (fully above).
      const progress = 1 - (rect.bottom / (viewH + rect.height));
      const clampedProgress = Math.max(0, Math.min(1, progress));

      // How much extra height does the image have over the container?
      const containerH = container.offsetHeight;
      const imageH = image.offsetHeight;
      const maxShift = imageH - containerH;

      // Shift the image from 0 (top of image visible) to -maxShift (bottom visible)
      const shift = -clampedProgress * maxShift;
      setOffset(shift);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Container height as vw-based percentage matching the original 1920px design
  const containerHeightVw = panel.heightRatio * 100; // in vw units

  // Image height is always taller than container so parallax scroll is possible.
  // We ensure the image is at least (imageHeightRatio * 100)vw tall, but never
  // shorter than the container + a scroll buffer.
  const imageHeightVw = Math.max(panel.imageHeightRatio * 100, containerHeightVw + 8);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: `${containerHeightVw}vw` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={panel.src}
        alt={panel.alt}
        className="absolute left-0 w-full select-none pointer-events-none"
        style={{
          // Use min-height to guarantee it's always taller than the container
          height: `${imageHeightVw}vw`,
          top: `${offset}px`,
          // For the peachfooter which is rendered much wider than its source,
          // use object-fit cover with focal-point object-position
          objectFit: 'cover',
          objectPosition: `${panel.focalX}% ${panel.focalY}%`,
          // Prevent layout shift flicker
          willChange: 'top',
        }}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

export default function Section4() {
  return (
    <section
      id="section-4"
      className="w-full"
      style={{ backgroundColor: 'rgb(0, 0, 0)' }}
    >
      {PANELS.map((panel, index) => (
        <ParallaxPanel key={index} panel={panel} index={index} />
      ))}
    </section>
  );
}
