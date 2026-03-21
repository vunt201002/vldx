import useReveal from '@/hooks/useReveal';

export default function Collections({ id, settings, blocks }) {
  const sectionRef = useReveal();

  const products = blocks.filter((b) => b.type === 'product-card');

  return (
    <section id={id} className="bg-cream py-24 lg:py-36 relative" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal mb-16 lg:mb-24">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">{settings.overline}</span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
            {settings.title} <span className="italic text-concrete">{settings.titleAccent}</span>
          </h2>
          <p className="mt-6 font-body text-warm-500 max-w-xl leading-relaxed">
            {settings.description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((block) => {
            const p = block.settings;
            return (
              <a
                key={p.slug}
                href={`/materials?category=${p.slug}`}
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
              >
                {/* Product image or gradient fallback */}
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.color} transition-transform duration-700 group-hover:scale-105`} />
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }} />
                  </>
                )}
                {/* Dark overlay for text readability on images */}
                {p.image && <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />}

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
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
