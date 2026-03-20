export const icons = {
  handcraft: (props) => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <circle cx="20" cy="20" r="18" />
      <path d="M20 8v24M8 20h24" />
    </svg>
  ),
  natural: (props) => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M6 34L20 6l14 28H6z" />
      <circle cx="20" cy="24" r="4" />
    </svg>
  ),
  sizes: (props) => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <rect x="4" y="4" width="32" height="32" rx="2" />
      <path d="M4 20h32M20 4v32" />
    </svg>
  ),
  warranty: (props) => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M20 4C11 4 4 11 4 20s7 16 16 16" />
      <path d="M20 4c9 0 16 7 16 16s-7 16-16 16" strokeDasharray="4 4" />
      <circle cx="20" cy="20" r="6" />
    </svg>
  ),
  phone: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  email: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  location: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
      <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};
