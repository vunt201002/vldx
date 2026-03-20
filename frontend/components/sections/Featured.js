import useReveal from '@/hooks/useReveal';
import { icons } from './icons';

export default function Featured({ settings, blocks }) {
  const sectionRef = useReveal();

  const features = blocks.filter((b) => b.type === 'feature-card');

  return (
    <section className="bg-cream py-24 lg:py-36 relative" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal text-center mb-16 lg:mb-24">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">{settings.overline}</span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
            {settings.title} <span className="italic text-concrete">{settings.titleAccent}</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-sand">
          {features.map((block, i) => {
            const f = block.settings;
            const Icon = icons[f.iconName];
            return (
              <div
                key={i}
                className="bg-cream p-8 lg:p-10 group hover:bg-warm-50 transition-colors duration-500"
              >
                <div className="mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  {Icon && <Icon className="w-10 h-10 text-sandstone" />}
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">
                  {f.title}
                </h3>
                <p className="font-body text-sm text-warm-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
