import { useEffect, useRef } from 'react';

export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Promote to GPU layer just before animating, then clean up
            entry.target.style.willChange = 'opacity, transform';
            entry.target.classList.add('visible');
            const cleanup = () => {
              entry.target.style.willChange = '';
              entry.target.removeEventListener('transitionend', cleanup);
            };
            entry.target.addEventListener('transitionend', cleanup, { once: true });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    );

    const targets = node.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
    targets.forEach((el) => observer.observe(el));

    // Also observe the node itself if it has a reveal class
    if (node.classList.contains('reveal') || node.classList.contains('reveal-left') || node.classList.contains('reveal-right') || node.classList.contains('stagger-children')) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
