import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar({ settings, blocks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Use resolved menuItems if available (from menuHandle), fall back to manual links
  const menuItems = settings.menuItems || [];
  const navLinks = menuItems.length > 0
    ? menuItems.map((item) => ({
        type: 'nav-link',
        settings: { label: item.label, href: item.url },
      }))
    : blocks.filter((b) => b.type === 'nav-link');
  const isLogo = settings.brandMode === 'logo' && settings.logoUrl;
  const logoMaxW = settings.logoMaxWidth ? `${settings.logoMaxWidth}px` : '160px';
  const navBg = settings.navBgColor || undefined;
  const fontSize = settings.menuFontSize || '0.8rem';
  const color = settings.menuColor || undefined;
  const hoverColor = settings.menuHoverColor || undefined;

  const linkStyle = {
    fontSize,
    ...(color ? { color } : {}),
  };

  return (
    <nav className="relative z-50 border-b border-warm-300/50" style={navBg ? { backgroundColor: navBg } : undefined}>
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

            {/* Auth */}
            {!isLoading && (
              isAuthenticated ? (
                <div ref={dropdownRef} className="relative ml-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 font-body text-warm-600 hover:text-warm-800 transition-colors"
                    style={{ fontSize }}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-200 text-xs font-bold text-warm-700">
                      {(user?.firstName || 'U')[0].toUpperCase()}
                    </span>
                    <span className="tracking-[0.1em] lowercase hidden xl:inline">
                      {user?.firstName || 'Account'}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-warm-200 bg-white py-1.5 shadow-lg z-50">
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50 transition-colors"
                      >
                        Tai khoan
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-warm-700 hover:bg-warm-50 transition-colors"
                      >
                        Dang xuat
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 font-body tracking-[0.15em] lowercase transition-colors duration-200"
                  style={linkStyle}
                >
                  dang nhap
                </Link>
              )
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
        <div className="border-t border-warm-300/50 px-6 py-5 space-y-3" style={navBg ? { backgroundColor: navBg } : undefined}>
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

          {/* Mobile auth links */}
          {!isLoading && (
            <div className="border-t border-warm-300/30 pt-3 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body tracking-[0.15em] lowercase transition-colors"
                    style={{ fontSize, color: color || '#6B5D4E' }}
                  >
                    tai khoan ({user?.firstName})
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="block font-body tracking-[0.15em] lowercase transition-colors mt-3 text-left"
                    style={{ fontSize, color: color || '#6B5D4E' }}
                  >
                    dang xuat
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body tracking-[0.15em] lowercase transition-colors"
                    style={{ fontSize, color: color || '#6B5D4E' }}
                  >
                    dang nhap
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body tracking-[0.15em] lowercase transition-colors mt-3"
                    style={{ fontSize, color: color || '#6B5D4E' }}
                  >
                    dang ky
                  </Link>
                </>
              )}
            </div>
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
