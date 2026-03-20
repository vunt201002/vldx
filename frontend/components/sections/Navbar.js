import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ settings, blocks }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = blocks.filter((b) => b.type === 'nav-link');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/landing" className="font-display text-2xl lg:text-3xl tracking-tight">
            <span className={`transition-colors duration-500 ${scrolled ? 'text-charcoal' : 'text-white'}`}>
              {settings.brandName} <span className="text-sandstone italic">{settings.brandAccent}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.settings.label}
                href={link.settings.href}
                className={`font-body text-sm tracking-widest lowercase transition-colors duration-300 hover:text-sandstone ${
                  scrolled ? 'text-warm-600' : 'text-white/80'
                }`}
              >
                {link.settings.label}
              </a>
            ))}
            <a
              href={settings.ctaHref}
              className={`font-body text-sm tracking-widest lowercase border-b transition-all duration-300 hover:text-sandstone hover:border-sandstone pb-0.5 ${
                scrolled ? 'text-warm-600 border-warm-400' : 'text-white/80 border-white/40'
              }`}
            >
              {settings.ctaLabel}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden transition-colors ${scrolled ? 'text-charcoal' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-cream/98 backdrop-blur-xl border-t border-sand px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.settings.label}
              href={link.settings.href}
              onClick={() => setMenuOpen(false)}
              className="block font-body text-base tracking-widest lowercase text-warm-700 hover:text-sandstone transition-colors"
            >
              {link.settings.label}
            </a>
          ))}
          <a
            href={settings.ctaHref}
            onClick={() => setMenuOpen(false)}
            className="block font-body text-base tracking-widest lowercase text-sandstone"
          >
            {settings.ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}
