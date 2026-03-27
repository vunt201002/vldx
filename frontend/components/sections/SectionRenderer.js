import { registry } from './registry';

export default function SectionRenderer({ config }) {
  // Split sections into hero (sticky background) and the rest (scrolls over hero)
  const heroKeys = [];
  const contentKeys = [];
  let pastHero = false;

  for (const key of config.order) {
    const section = config.sections[key];
    if (!section) continue;
    if (!pastHero && section.type === 'hero') {
      heroKeys.push(key);
    } else {
      pastHero = true;
      contentKeys.push(key);
    }
  }

  const hasHero = heroKeys.length > 0;

  return (
    <>
      {/* Hero sections — sticky behind content */}
      {heroKeys.map((key, index) => {
        const section = config.sections[key];
        const Component = registry[section.type];
        if (!Component) return null;
        return (
          <Component
            key={`${key}-${index}`}
            id={key}
            settings={section.settings}
            blocks={section.blocks || []}
          />
        );
      })}

      {/* Content sections — scroll over the hero */}
      <div className={hasHero ? 'hero-content-overlay' : undefined}>
        {contentKeys.map((key, index) => {
          const section = config.sections[key];
          if (!section) return null;
          const Component = registry[section.type];
          if (!Component) return null;
          return (
            <Component
              key={`${key}-${index}`}
              id={key}
              settings={section.settings}
              blocks={section.blocks || []}
            />
          );
        })}
      </div>
    </>
  );
}
