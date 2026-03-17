/**
 * Section2 — Main content area
 * Cloned from concrete-collaborative.com
 *
 * Original rect: 1920 × 7862px (y: 86)
 * Contains:
 *   1. Hero — split layout: lightimage1.png left, text + shop CTA right
 *   2. Product category button grid — 9 image-link tiles (3×3)
 *   3. Press + Projects — two full-width image cards side by side
 *   4. Ingredients — full-width broken-terrazzo background with centred text
 *   5. Why Concrete / Environmental Story — two-column info cards
 *   6. The Makers — portrait + bio text
 *   7. Outdoor Living — full-width promo banner
 *   8. In-Stock Shop — full-width promo banner
 */

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCT_CATEGORIES = [
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743025520859-CDDVYDM76QGKBGKKLP26/HomeButtonCounter.jpg?format=750w',
    label: 'Counter Tops',
    href: '/counter-tops',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1677095895920-WEGBWB5BULA4K93STQCX/HomeButtonTerrazzoTiles.jpg?format=750w',
    label: 'Terrazzo Tiles',
    href: '/terrazzo-tiles',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1677095329566-JRE132A0I29OPQ9AMZ9G/HomeButtonPatt.jpg?format=750w',
    label: 'Patterned Tiles',
    href: '/patterned-tiles',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743024077224-XU7XQ8C0RH7OUZ20CQJ7/HomeButtonConcrete.jpg?format=750w',
    label: 'Concrete Tile',
    href: '/concrete-tiles',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1677093643562-2SSPIH8OPN0829V88JEH/HomeButtonBreeze.jpg?format=750w',
    label: 'Breeze Block',
    href: '/breeze-block',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1650486885568-1WQFQPFINA9M7WN3O7AB/homebuttonpavers.jpg?format=750w',
    label: 'Pavers',
    href: '/pavers',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1684777602764-CZ3SYDQGPB2VCJW4LDZN/stairs+2.png?format=750w',
    label: 'Stairs',
    href: '/stairspage',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1698772215712-46X55Z8YQGCQ7D9MF2HK/HomeButtonBasins.png?format=750w',
    label: 'Basins',
    href: '/basins',
  },
  {
    src: 'https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1743024924950-CWG9I18PI6QL957LS6W5/HomeButtonTableTops.jpg?format=750w',
    label: 'Table Tops',
    href: '/table-tops',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** 1. Hero — lightimage on left, heading + body + CTA on right */
function HeroBlock() {
  return (
    <div className="w-full flex flex-col md:flex-row items-stretch bg-white">
      {/* Left: hero image */}
      <div className="w-full md:w-1/2 relative overflow-hidden" style={{ minHeight: '480px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584991447258-2VEIRTCVITYYRJTHXUQX/lightimage1.png"
          alt="light concrete terrazzo tile"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Right: text block */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-24"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
        >
          modern concrete + terrazzo architectural finishes.
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8"
          style={{ color: 'rgb(0,0,0)', maxWidth: '520px' }}
        >
          pair our products together to flow seamlessly from inside to out. we offer floor &amp;
          wall tiles, exterior pavers, pool copings, countertops, vanities, stair-treads, encaustic
          cement tiles, breeze-blocks, tabletops and basins in modern colors and natural stone
          aggregates.
        </p>

        <a
          href="/shop"
          className="inline-block self-start text-xs font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '0.15em' }}
        >
          shop
        </a>
      </div>
    </div>
  );
}

/** 2. Product category button grid — 3 columns × 3 rows */
function CategoryGrid() {
  return (
    <div
      className="w-full"
      style={{ backgroundColor: 'rgb(255,255,255)' }}
    >
      <div className="grid grid-cols-3" style={{ gap: '1px', backgroundColor: 'rgb(220,220,220)' }}>
        {PRODUCT_CATEGORIES.map((cat) => (
          <a
            key={cat.href}
            href={cat.href}
            className="relative block overflow-hidden group bg-white"
            style={{ aspectRatio: '1 / 1' }}
          >
            {/* Category image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.src}
              alt={cat.label}
              className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              loading="lazy"
              decoding="async"
            />

            {/* Label overlay — bottom-centre */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4 md:pb-6"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 100%)',
              }}
            >
              <span
                className="text-white text-xs md:text-sm font-medium tracking-widest uppercase text-center"
                style={{ letterSpacing: '0.12em', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                {cat.label}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/** 3. Press + Projects — two side-by-side image cards */
function PressProjects() {
  return (
    <div className="w-full" style={{ backgroundColor: 'rgb(255,255,255)' }}>
      {/* Section heading */}
      <div className="text-center py-10 md:py-14 px-6">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-4"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
        >
          press + projects
        </h2>
        <p
          className="text-sm md:text-base leading-relaxed mx-auto"
          style={{ color: 'rgb(0,0,0)', maxWidth: '600px' }}
        >
          explore the latest projects and features from concrete collaborative. designer
          collaborations and modern aesthetic inspiration.
        </p>
      </div>

      {/* Two image cards */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Projects card */}
        <a
          href="/projects"
          className="relative block overflow-hidden group"
          style={{ aspectRatio: '4 / 3' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/6ad859f4-007b-4826-bcd5-fcd09c7f3209/projectsbuttonlaundry.png"
            alt="projects"
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            <span
              className="text-white text-lg md:text-xl font-light tracking-widest uppercase"
              style={{ letterSpacing: '0.2em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              projects
            </span>
          </div>
        </a>

        {/* Press card */}
        <a
          href="/press"
          className="relative block overflow-hidden group"
          style={{ aspectRatio: '4 / 3' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/8aa9c6c6-b503-43e9-be34-99d043c02ce0/pressbutton_shower.png"
            alt="press"
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            <span
              className="text-white text-lg md:text-xl font-light tracking-widest uppercase"
              style={{ letterSpacing: '0.2em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              press
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

/** 4. Ingredients — full-width section with broken-terrazzo background */
function IngredientsBlock() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: '480px', backgroundColor: 'rgb(240,238,232)' }}
    >
      {/* Background broken terrazzo image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584995197950-UYLNPKVCU97K7XBL8GHF/Broken-Terrazo.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center center', opacity: 0.35 }}
        loading="lazy"
        decoding="async"
      />

      {/* Centred text content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-20 md:py-28 mx-auto" style={{ maxWidth: '860px' }}>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
        >
          the ingredients make the difference.
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8"
          style={{ color: 'rgb(0,0,0)', maxWidth: '640px' }}
        >
          handcrafted in southern california using only the finest raw materials and
          environmentally responsible manufacturing practices. we believe in process, precision, and
          beauty that endures.
        </p>

        <a
          href="https://www.sunset.com/home-garden/design/emerging-designers-concrete-collaborative-tile"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '0.15em' }}
        >
          learn more
        </a>
      </div>
    </div>
  );
}

/** 5. Why Concrete / Environmental Story — two-column info cards */
function InfoCards() {
  return (
    <div
      className="w-full"
      style={{ backgroundColor: 'rgb(255,255,255)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Why Concrete */}
        <div className="flex flex-col overflow-hidden">
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585338069372-KE2WJXZHX8ULZQS3RCEQ/Screen+Shot+2020-03-27+at+12.40.39+PM.png?format=500w"
              alt="why concrete"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col flex-1 justify-between px-8 py-8 md:px-10 md:py-10" style={{ backgroundColor: 'rgb(255,255,255)' }}>
            <div>
              <a
                href="/info/why-concrete"
                className="block text-lg md:text-xl font-light mb-3 hover:underline"
                style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
              >
                why concrete
              </a>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'rgb(0,0,0)', maxWidth: '460px' }}
              >
                concrete has led the design industry's transition to more modern, sustainable
                building materials. find out why architects, designers, and homeowners are choosing
                concrete for every surface.
              </p>
            </div>
            <a
              href="/info/why-concrete"
              className="inline-block self-start text-xs font-medium tracking-wider hover:underline"
              style={{ color: 'rgb(0,0,0)' }}
            >
              Read More →
            </a>
          </div>
        </div>

        {/* Environmental Story */}
        <div className="flex flex-col overflow-hidden" style={{ borderLeft: '1px solid rgb(220,220,220)' }}>
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585338231022-DNAXIY9O7EAOPJV9PQAA/Why+Concrete.jpg?format=500w"
              alt="environmental story"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col flex-1 justify-between px-8 py-8 md:px-10 md:py-10" style={{ backgroundColor: 'rgb(255,255,255)' }}>
            <div>
              <a
                href="/info/environmental-story"
                className="block text-lg md:text-xl font-light mb-3 hover:underline"
                style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
              >
                environmental story
              </a>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'rgb(0,0,0)', maxWidth: '460px' }}
              >
                sustainability is at our core. from raw material sourcing to manufacturing and
                shipping, we work hard to minimise our impact on the environment.
              </p>
            </div>
            <a
              href="/info/environmental-story"
              className="inline-block self-start text-xs font-medium tracking-wider hover:underline"
              style={{ color: 'rgb(0,0,0)' }}
            >
              Read More →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

/** 6. The Makers — portrait on left, bio text on right */
function TheMakers() {
  return (
    <div
      className="w-full flex flex-col md:flex-row items-stretch"
      style={{ backgroundColor: 'rgb(255,255,255)', borderTop: '1px solid rgb(220,220,220)' }}
    >
      {/* Portrait image */}
      <div className="w-full md:w-2/5 relative overflow-hidden" style={{ minHeight: '400px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/49f5b1b6-2892-4717-9ef8-a7bab39f3957/kate.png"
          alt="kate — concrete collaborative"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Bio text */}
      <div
        className="w-full md:w-3/5 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-20"
        style={{ backgroundColor: 'rgb(255,255,255)' }}
      >
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 leading-tight"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
        >
          the makers
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-6"
          style={{ color: 'rgb(0,0,0)', maxWidth: '520px' }}
        >
          we are a five-person family operation combining backgrounds in architecture, design,
          fine arts and manufacturing. based in southern california, we are driven by a shared
          passion for material craft and modern beauty.
        </p>

        <a
          href="https://interiordesign.net/projects/surf-sand-and-concrete-inside-one-manufacturer-s-key-to-success/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block self-start text-xs font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '0.15em' }}
        >
          the makers
        </a>
      </div>
    </div>
  );
}

/** 7. Outdoor Living promo banner */
function OutdoorBanner() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: '480px', backgroundColor: 'rgb(200,210,195)' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/b1b0db37-d24a-4c1d-a4dc-600025690e74/outdoorgreenright.png"
        alt="outdoor concrete living"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
        loading="lazy"
        decoding="async"
      />

      {/* Overlay text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-20 md:py-28 mx-auto"
        style={{ maxWidth: '720px' }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight text-white"
          style={{ letterSpacing: '-0.01em', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
        >
          outdoor living
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8 text-white"
          style={{ maxWidth: '560px', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          our full exterior range of concrete pavers, pool copings, step treads, and breeze blocks
          are designed for commercial and residential projects alike.
        </p>

        <a
          href="https://www.concrete-collaborative.com/outdoor"
          className="inline-block text-xs font-medium tracking-widest uppercase border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-200"
          style={{ letterSpacing: '0.15em' }}
        >
          explore outdoor
        </a>
      </div>
    </div>
  );
}

/** 8. In-Stock Shop promo banner */
function InStockBanner() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: '480px', backgroundColor: 'rgb(230,195,195)' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/4cc2a380-4c1f-4608-a94d-e26250fe255a/shopinstockpinkleft.png"
        alt="in-stock tiles"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
        loading="lazy"
        decoding="async"
      />

      {/* Overlay text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-20 md:py-28 mx-auto"
        style={{ maxWidth: '720px' }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '-0.01em' }}
        >
          shop in-stock
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8"
          style={{ color: 'rgb(0,0,0)', maxWidth: '560px' }}
        >
          ready-to-ship terrazzo, cement, and concrete tiles. no lead time — order today and
          receive your tiles within days.
        </p>

        <a
          href="/order-in-stock"
          className="inline-block text-xs font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
          style={{ color: 'rgb(0,0,0)', letterSpacing: '0.15em' }}
        >
          shop now
        </a>
      </div>
    </div>
  );
}

/** 9. Pacifica feature — full-width image with centred CTA */
function PacificaFeature() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: '540px', backgroundColor: 'rgb(230,225,218)' }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1768243985842-BGCPNOLXQ3WHGXCK4N6Y/image-asset.jpeg"
        alt="Pacifica collection"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
        loading="lazy"
        decoding="async"
      />

      {/* Centred text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-20 md:py-28 mx-auto"
        style={{ maxWidth: '720px' }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight text-white"
          style={{ letterSpacing: '-0.01em', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
        >
          pacifica
        </h2>

        <a
          href="/pacifica"
          className="inline-block text-xs font-medium tracking-widest uppercase border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-200"
          style={{ letterSpacing: '0.15em' }}
        >
          explore
        </a>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function Section2() {
  return (
    <section
      id="section-2"
      className="w-full"
      style={{ color: 'rgb(0,0,0)', backgroundColor: 'rgb(255,255,255)' }}
    >
      {/* 1. Hero */}
      <HeroBlock />

      {/* 2. Product category grid */}
      <CategoryGrid />

      {/* 3. Press + Projects */}
      <PressProjects />

      {/* 4. Ingredients philosophy */}
      <IngredientsBlock />

      {/* 5. Why Concrete + Environmental Story */}
      <InfoCards />

      {/* 6. The Makers */}
      <TheMakers />

      {/* 7. Outdoor living promo */}
      <OutdoorBanner />

      {/* 8. In-stock shop promo */}
      <InStockBanner />

      {/* 9. Pacifica feature */}
      <PacificaFeature />
    </section>
  );
}
