import contact from '@/config/contact.json';

const items = [
  {
    key: 'phone',
    label: 'Goi dien',
    href: `tel:${contact.phone}`,
    hoverColor: '#16a34a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    key: 'zalo',
    label: 'Zalo',
    href: contact.zalo,
    hoverColor: '#0068FF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.03 2 10.94c0 2.78 1.44 5.28 3.72 6.93V22l3.86-2.12c1.07.3 2.2.46 3.42.46 5.52 0 10-4.03 10-8.94S17.52 2 12 2z" />
        <path d="M9.5 9h3.5c.28 0 .5.22.5.5 0 .12-.04.23-.12.32l-3.2 3.6h3.39" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: contact.tiktok,
    hoverColor: '#1A1714',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
      </svg>
    ),
  },
];

export default function ContactFAB() {
  return (
    <div className="fab-dock fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-1 rounded-2xl p-1.5 sm:p-2 shadow-md"
      style={{
        backgroundColor: '#F5F0EB',
        border: '1px solid rgba(196, 168, 130, 0.4)',
      }}
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          title={item.label}
          aria-label={item.label}
          className="fab-dock-btn flex items-center justify-center rounded-[10px] transition-all duration-300"
          style={{ '--hover-color': item.hoverColor }}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
