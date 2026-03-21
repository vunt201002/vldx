import useReveal from '@/hooks/useReveal';

export default function About({ id, settings, blocks }) {
  const sectionRef = useReveal();

  const stats = blocks.filter((b) => b.type === 'stat');

  return (
    <section id={id} className="relative bg-charcoal text-white overflow-hidden diagonal-top grain-overlay" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-32 lg:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Story */}
          <div className="reveal-left">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">{settings.overline}</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
              {settings.title}
              <br />
              <span className="italic text-sandstone">{settings.titleAccent}</span>
            </h2>
            <div className="mt-8 space-y-5 font-body text-warm-300 leading-relaxed">
              {settings.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            <a
              href={settings.linkHref}
              className="inline-flex items-center gap-3 mt-10 font-body text-sm tracking-widest uppercase text-sandstone border-b border-sandstone/40 pb-1 hover:border-sandstone transition-colors duration-300"
            >
              {settings.linkText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right: Stats + Visual */}
          <div className="reveal-right">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {stats.map((block) => (
                <div key={block.settings.label} className="border border-warm-700/50 p-6 lg:p-8">
                  <div className="font-display text-4xl lg:text-5xl text-sandstone italic">
                    {block.settings.value}
                  </div>
                  <div className="mt-2 font-body text-xs tracking-[0.2em] uppercase text-warm-400">
                    {block.settings.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual element */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
              {settings.visualImage ? (
                <img
                  src={settings.visualImage}
                  alt={settings.visualText || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-600 to-warm-800" />
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }} />
                </>
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 h-full flex items-end p-8">
                <div>
                  <div className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">{settings.visualLabel}</div>
                  <div className="font-display text-2xl lg:text-3xl text-white italic">{settings.visualText}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
