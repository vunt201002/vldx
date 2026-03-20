import { registry } from './registry';

export default function SectionRenderer({ config }) {
  return (
    <>
      {config.order.map((key, index) => {
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
    </>
  );
}
