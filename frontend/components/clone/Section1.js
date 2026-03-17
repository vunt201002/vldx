import { useState } from 'react';

/**
 * Section1 — Header / Navigation Bar
 *
 * Replicates the concrete-collaborative.com header (header.Header).
 * Captured dimensions: 1920 × 86.23px
 * Background: rgb(247, 226, 206) — warm peach/sand
 *
 * Layout:
 *  Left   — CC word-mark logo (links to /)
 *  Center — horizontal nav links (14 items, all lowercase)
 *  Right  — Search icon + Cart icon (with count badge)
 *
 * Mobile: logo stays left, nav links collapse into a hamburger menu (right).
 */

const NAV_LINKS = [
  { text: 'pacifica',   href: '/pacifica' },
  { text: 'venice',     href: '/venice' },
  { text: 'strands',    href: '/strands' },
  { text: 'trails',     href: '/trails' },
  { text: 'laguna',     href: '/laguna' },
  { text: 'solana',     href: '/solana' },
  { text: 'rivi',       href: '/rivi' },
  { text: 'trestles',   href: '/trestles' },
  { text: 'salt',       href: '/salt' },
  { text: 'bondi',      href: '/bondi' },
  { text: 'ventura',    href: '/ventura' },
  { text: 'shop',       href: '/shop' },
  { text: 'featured',   href: 'https://www.concrete-collaborative.com/press-projects-landing' },
  { text: 'contact us', href: '/contactus' },
];

const LOGO_SRC =
  '//images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/7e5836f6-d36a-4433-b2ea-89324e5191e4/black+cc+word+logo-02.png';

// SVG icons inlined to avoid any external dependency

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: 18, height: 18 }}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: 18, height: 18 }}
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ width: 22, height: 22 }}
    >
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ width: 22, height: 22 }}
    >
      <line x1="18" y1="6"  x2="6" y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

export default function Section1() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const BG = 'rgb(247, 226, 206)';
  const LINK_STYLE = {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'rgb(0, 0, 0)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <header
      role="banner"
      style={{ backgroundColor: BG, position: 'relative', zIndex: 100 }}
      className="w-full"
    >
      {/* ── Desktop / tablet bar ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex items-center w-full"
        style={{ height: '86px', paddingLeft: '24px', paddingRight: '24px' }}
      >
        {/* Logo — left */}
        <a
          href="/"
          aria-label="concrete collaborative home"
          className="flex-shrink-0 mr-6"
          style={{ lineHeight: 0 }}
        >
          <img
            src={LOGO_SRC}
            alt="concrete collaborative"
            style={{ height: '28px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* Nav links — fill remaining center space, wrap gracefully */}
        <nav
          aria-label="primary"
          className="flex flex-wrap items-center justify-center flex-1 gap-x-5 gap-y-1"
          style={{ minWidth: 0 }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href + link.text}
              href={link.href}
              style={LINK_STYLE}
              className="hover:opacity-60 transition-opacity duration-150"
            >
              {link.text}
            </a>
          ))}
        </nav>

        {/* Right icons — search + cart */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-6">
          <a
            href="/search"
            aria-label="search"
            style={{ color: 'rgb(0,0,0)', lineHeight: 0 }}
            className="hover:opacity-60 transition-opacity duration-150"
          >
            <SearchIcon />
          </a>
          <a
            href="/cart"
            aria-label="cart, 0 items"
            style={{ color: 'rgb(0,0,0)', lineHeight: 0, position: 'relative' }}
            className="hover:opacity-60 transition-opacity duration-150"
          >
            <CartIcon />
            {/* Cart count badge */}
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '9px',
                lineHeight: 1,
                color: 'rgb(0,0,0)',
              }}
            >
              0
            </span>
          </a>
        </div>
      </div>

      {/* ── Mobile bar ────────────────────────────────────────────────── */}
      <div
        className="flex lg:hidden items-center justify-between w-full"
        style={{ height: '60px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        {/* Logo */}
        <a href="/" aria-label="concrete collaborative home" style={{ lineHeight: 0 }}>
          <img
            src={LOGO_SRC}
            alt="concrete collaborative"
            style={{ height: '22px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* Right: cart + hamburger */}
        <div className="flex items-center gap-4">
          <a
            href="/cart"
            aria-label="cart, 0 items"
            style={{ color: 'rgb(0,0,0)', lineHeight: 0, position: 'relative' }}
          >
            <CartIcon />
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '9px',
                lineHeight: 1,
                color: 'rgb(0,0,0)',
              }}
            >
              0
            </span>
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'close navigation' : 'open navigation'}
            aria-expanded={mobileOpen}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              lineHeight: 0,
              color: 'rgb(0,0,0)',
            }}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          aria-label="primary mobile"
          className="lg:hidden flex flex-col"
          style={{
            backgroundColor: BG,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            paddingTop: '12px',
            paddingBottom: '20px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {/* Search in mobile drawer */}
          <a
            href="/search"
            aria-label="search"
            className="flex items-center gap-2 mb-3"
            style={{ ...LINK_STYLE, fontSize: '13px' }}
          >
            <SearchIcon />
            <span>search</span>
          </a>

          {/* Nav links stacked */}
          {NAV_LINKS.map((link) => (
            <a
              key={link.href + link.text}
              href={link.href}
              className="py-2 hover:opacity-60 transition-opacity duration-150"
              style={{
                ...LINK_STYLE,
                fontSize: '13px',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
              }}
            >
              {link.text}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
