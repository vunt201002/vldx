import { useState } from 'react';
import contact from '@/config/contact.json';

const items = [
  {
    key: 'phone',
    label: 'Goi dien',
    href: `tel:${contact.phone}`,
    color: '#16a34a',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    key: 'zalo',
    label: 'Zalo',
    href: contact.zalo,
    color: '#0068FF',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.03 2 10.94c0 2.78 1.44 5.28 3.72 6.93V22l3.86-2.12c1.07.3 2.2.46 3.42.46 5.52 0 10-4.03 10-8.94S17.52 2 12 2zm1.07 12.03H9.6l-.02-.02c-.2-.2-.2-.52 0-.72l3.2-3.7H9.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h3.5c.28 0 .5.22.5.5 0 .12-.04.23-.12.32l-3.2 3.6h3.39c.28 0 .5.23.5.51s-.22.51-.5.51z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    href: `mailto:${contact.email}`,
    color: '#EA4335',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: contact.tiktok,
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.41a8.16 8.16 0 004.76 1.52V7.56a4.85 4.85 0 01-1-.87z" />
      </svg>
    ),
  },
];

export default function ContactFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse items-end gap-3">
      {/* Contact buttons — appear when open */}
      {open && items.map((item, i) => (
        <a
          key={item.key}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          title={item.label}
          className="flex items-center gap-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: item.color,
            color: '#fff',
            padding: '10px 16px',
            animation: `fab-pop-in 0.2s ease ${i * 0.05}s both`,
          }}
        >
          {item.icon}
          <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
        </a>
      ))}

      {/* Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105"
        style={{
          background: open ? '#555' : 'linear-gradient(135deg, #C4A882, #8B7D6B)',
        }}
        aria-label="Lien he"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          style={{
            transition: 'transform 0.3s',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
