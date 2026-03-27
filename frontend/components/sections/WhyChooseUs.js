import useReveal from '@/hooks/useReveal';

export default function WhyChooseUs({ settings, blocks }) {
  const sectionRef = useReveal();

  const steps = blocks.filter((b) => b.type === 'why-step');

  const sectionStyle = {};
  if (settings.bgColor) sectionStyle.backgroundColor = settings.bgColor;
  if (settings.bgImage) {
    sectionStyle.backgroundImage = `url(${settings.bgImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  return (
    <section className="py-20 lg:py-28 relative" style={sectionStyle} ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal text-center mb-16 lg:mb-20">
          {settings.overline && (
            <span className="inline-flex items-center gap-3 font-body text-xs tracking-[0.3em] uppercase text-teal-600">
              <span className="w-8 h-px bg-teal-400" />
              {settings.overline}
              <span className="w-8 h-px bg-teal-400" />
            </span>
          )}
          {settings.title && (
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal font-bold leading-tight">
              {settings.title}
            </h2>
          )}
        </div>

        {/* Steps with wave connector */}
        <div className="stagger-children relative">
          {/* Dashed connector line (desktop only) */}
          {steps.length > 1 && (
            <svg
              className="hidden lg:block absolute top-[72px] left-0 w-full pointer-events-none"
              viewBox="0 0 1200 80"
              preserveAspectRatio="none"
              fill="none"
              style={{ height: 80 }}
            >
              <path
                d={generateWavePath(steps.length, 1200)}
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="8 6"
                fill="none"
              />
            </svg>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((block, i) => {
              const s = block.settings;
              const isEven = i % 2 === 0;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center"
                  style={{ marginTop: isEven ? 0 : 40 }}
                >
                  {/* Circular icon */}
                  <div
                    className="w-28 h-28 lg:w-36 lg:h-36 rounded-full flex items-center justify-center mb-6 relative z-10"
                    style={{ backgroundColor: s.iconBgColor || '#FFD580' }}
                  >
                    {s.icon && (
                      <img
                        src={s.icon}
                        alt={s.title || ''}
                        className="w-14 h-14 lg:w-18 lg:h-18 object-contain"
                      />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg lg:text-xl text-charcoal font-semibold mb-3 leading-snug max-w-[240px]">
                    {s.title}
                  </h3>

                  {/* Description */}
                  {s.desc && (
                    <p className="font-body text-sm text-gray-500 leading-relaxed max-w-[280px]">
                      {s.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Generate an SVG wave path connecting step centers.
 * Steps alternate up/down to create the wave effect seen in the design.
 */
function generateWavePath(count, width) {
  if (count < 2) return '';

  const gap = width / count;
  const points = [];

  for (let i = 0; i < count; i++) {
    const x = gap * i + gap / 2;
    const y = i % 2 === 0 ? 10 : 70;
    points.push({ x, y });
  }

  // Build smooth cubic bezier path
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpx = (curr.x + next.x) / 2;
    d += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
  }

  return d;
}
