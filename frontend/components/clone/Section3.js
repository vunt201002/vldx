import { useEffect, useRef, useState } from 'react';

/**
 * Section3 — Full-bleed parallax banner image
 *
 * Replicates the concrete-collaborative.com Parallax-item section
 * containing IMG_0012-3.JPG (1920×1280). The visible window is ~581px tall.
 * The image focal point is approximately (0.518, 0.860) — lower-centre.
 *
 * On the original page this uses a JS-driven parallax transform; here we
 * replicate the resting state faithfully and add a lightweight scroll-based
 * parallax effect via a ResizeObserver + scroll listener.
 */

const IMAGE_SRC =
  'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1650916498846-WIN385GTSZOJF38NZB9U/IMG_0012-3.JPG?format=2500w';
const IMAGE_ALT = 'IMG_0012-3.JPG';

// Natural dimensions of the source image
const IMG_NATURAL_W = 2304;
const IMG_NATURAL_H = 1536;
// Aspect ratio: 2304/1536 = 1.5

// Section visible height as captured (px)
const SECTION_HEIGHT = 581;

export default function Section3() {
  const sectionRef = useRef(null);
  const figureRef = useRef(null);
  const imgRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(-43); // resting state from source HTML

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const PARALLAX_RANGE = 120; // px — total vertical travel of the image

    function updateParallax() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when section bottom enters viewport, 1 when section top leaves
      const progress = 1 - (rect.bottom / (vh + rect.height));
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = -PARALLAX_RANGE / 2 + clamped * PARALLAX_RANGE;
      setParallaxY(Math.round(offset));
    }

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  // The figure overflows the section clip; the image is wider/taller than
  // the container and is positioned so the focal point is centred.
  // We replicate the source: image rendered at full container width,
  // figure has overflow:hidden and a negative bottom offset to allow vertical travel.

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: `${SECTION_HEIGHT}px` }}
      aria-label="Concrete materials banner"
    >
      {/* Figure acts as the parallax viewport clip */}
      <figure
        ref={figureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          // extend bottom past the section to give the parallax image room to move
          bottom: '-132px',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          transform: `translate3d(0px, ${parallaxY}px, 0px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <img
          ref={imgRef}
          src={IMAGE_SRC}
          alt={IMAGE_ALT}
          loading="lazy"
          decoding="async"
          style={{
            display: 'block',
            position: 'relative',
            left: 0,
            // Vertical offset places the focal point (y≈0.86) into view.
            // Source HTML: top: -332px on a 1280px-tall render → shows lower portion.
            top: '-332px',
            width: '100%',
            height: 'auto',
            // Ensure the image fills the container width regardless of viewport
            minWidth: '100%',
            // Maintain the source aspect ratio at full width
            aspectRatio: `${IMG_NATURAL_W} / ${IMG_NATURAL_H}`,
            fontSize: 0,
          }}
        />
      </figure>
    </section>
  );
}
