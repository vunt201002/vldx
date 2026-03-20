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
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
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
