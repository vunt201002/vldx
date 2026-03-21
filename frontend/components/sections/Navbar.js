import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ settings, blocks }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = blocks.filter((b) => b.type === 'nav-link');
  const isLogo = settings.brandMode === 'logo' && settings.logoUrl;
  const logoMaxW = settings.logoMaxWidth ? `${settings.logoMaxWidth}px` : '160px';
  const fontSize = settings.menuFontSize || '0.8rem';
  const color = settings.menuColor || undefined;
  const hoverColor = settings.menuHoverColor || undefined;

  const linkStyle = {
    fontSize,
    ...(color ? { color } : {}),
  };

  return (
    <nav className="relative z-50 bg-sand border-b border-warm-300/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-start gap-10 py-5 lg:py-6">
          {/* Brand: text or logo */}
          <Link href="/landing" className="flex-shrink-0 pt-0.5">
            {isLogo ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandName || 'Logo'}
                style={{ maxWidth: logoMaxW, height: 'auto' }}
                className="block"
              />
            ) : (
              <>
                <span className="font-display text-[1.7rem] leading-none tracking-tight text-warm-700 italic">
                  {settings.brandName}
                </span>
                {settings.brandAccent && (
                  <span className="block font-body text-[0.65rem] tracking-[0.35em] uppercase text-warm-500 mt-0.5">
                    {settings.brandAccent}
                  </span>
                )}
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-wrap items-center gap-x-7 gap-y-2 pt-1 justify-end flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.settings.label}
                href={link.settings.href}
                label={link.settings.label}
                style={linkStyle}
                hoverColor={hoverColor}
              />
            ))}
            {settings.ctaLabel && (
              <NavLink
                href={settings.ctaHref}
                label={settings.ctaLabel}
                style={linkStyle}
                hoverColor={hoverColor}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden ml-auto text-warm-700 pt-1"
            aria-label="Toggle menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
        menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-sand border-t border-warm-300/50 px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.settings.label}
              href={link.settings.href}
              onClick={() => setMenuOpen(false)}
              className="block font-body tracking-[0.15em] lowercase transition-colors"
              style={{ fontSize, color: color || '#6B5D4E' }}
            >
              {link.settings.label}
            </a>
          ))}
          {settings.ctaLabel && (
            <a
              href={settings.ctaHref}
              onClick={() => setMenuOpen(false)}
              className="block font-body tracking-[0.15em] lowercase transition-colors"
              style={{ fontSize, color: color || '#6B5D4E' }}
            >
              {settings.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, style, hoverColor }) {
  const [hovered, setHovered] = useState(false);

  const computedStyle = {
    ...style,
    ...(hovered && hoverColor ? { color: hoverColor } : {}),
  };

  return (
    <a
      href={href}
      className="font-body tracking-[0.15em] lowercase transition-colors duration-200"
      style={computedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}
