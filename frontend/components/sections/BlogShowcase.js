import { useState, useEffect, useRef, useCallback } from 'react';
import useReveal from '@/hooks/useReveal';
import { get } from '@/lib/api';

const SCROLL_SPEED = 8;

function SkeletonCard() {
  return (
    <div className="flex gap-4 py-4 border-b border-sand/60 animate-pulse">
      <div className="w-28 h-20 lg:w-40 lg:h-28 bg-warm-200 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-12 bg-warm-200 rounded" />
        <div className="h-4 w-3/4 bg-warm-200 rounded" />
        <div className="h-3 w-full bg-warm-100 rounded" />
      </div>
    </div>
  );
}

function PostCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <a
      href={`/blog/${post._id}`}
      className="group flex gap-4 lg:gap-6 py-4 border-b border-sand/60 hover:bg-white/40 transition-colors duration-300 px-2 -mx-2 rounded"
    >
      {/* Thumbnail */}
      <div className="w-28 h-20 lg:w-40 lg:h-28 flex-shrink-0 overflow-hidden rounded-md relative">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-warm-300 to-warm-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        {post.tags?.[0] && (
          <span className="font-body text-[10px] tracking-[0.15em] uppercase text-sandstone mb-1">
            {post.tags[0]}
          </span>
        )}
        <h3 className="font-display text-base lg:text-lg text-charcoal leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 font-body text-xs text-warm-500 leading-relaxed line-clamp-1 lg:line-clamp-2 hidden sm:block">
            {post.excerpt}
          </p>
        )}
        {date && (
          <span className="mt-1.5 block font-body text-[10px] tracking-wider uppercase text-warm-400">
            {date}
          </span>
        )}
      </div>
    </a>
  );
}

function ScrollButton({ direction, onMouseEnter, onMouseLeave }) {
  const isDown = direction === 'down';

  return (
    <div className="flex justify-center mt-6">
      <div
        className="w-10 h-10 rounded-full bg-warm-200/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-warm-300/90 hover:scale-110 transition-all duration-300 shadow-lg"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <svg
          className={`w-4 h-4 text-charcoal ${isDown ? 'rotate-90' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

export default function BlogShowcase({ id, settings }) {
  const sectionRef = useReveal();
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);

  // Fetch posts
  useEffect(() => {
    const count = settings.postCount || 8;
    const tagParam = settings.tag ? `&tag=${encodeURIComponent(settings.tag)}` : '';
    get(`/blog?limit=${count}${tagParam}`)
      .then((res) => setPosts(res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [settings.postCount, settings.tag]);

  // Measure first 4 cards to set container height, then enable overflow-y scroll
  useEffect(() => {
    if (!scrollRef.current || loading || posts.length <= 4) return;

    // Temporarily remove height constraint to measure natural heights
    scrollRef.current.style.maxHeight = 'none';
    scrollRef.current.style.overflowY = 'visible';

    const cards = scrollRef.current.querySelectorAll('[data-post-card]');
    let h = 0;
    for (let i = 0; i < Math.min(4, cards.length); i++) {
      h += cards[i].getBoundingClientRect().height;
    }

    setContainerHeight(h);

    // Re-apply constraints after measuring
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.style.maxHeight = `${h}px`;
      scrollRef.current.style.overflowY = 'auto';
    });
  }, [posts, loading]);

  // Track scroll for arrow visibility
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 10);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !containerHeight) return;
    // Delay to let the DOM settle with new maxHeight
    const timer = setTimeout(() => {
      updateScrollState();
    }, 100);
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [containerHeight, updateScrollState]);

  // Hover-to-scroll (vertical)
  const startScroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scroll = () => {
      el.scrollTop += direction * SCROLL_SPEED;
      rafRef.current = requestAnimationFrame(scroll);
    };
    rafRef.current = requestAnimationFrame(scroll);
  }, []);

  const stopScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const sectionStyle = {};
  if (settings.bgColor) sectionStyle.backgroundColor = settings.bgColor;

  const hasMore = posts.length > 4;

  return (
    <section id={id} className="py-24 lg:py-36 relative" style={sectionStyle} ref={sectionRef}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal mb-10 lg:mb-14">
          {settings.overline && (
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">
              {settings.overline}
            </span>
          )}
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-[1.1]">
            {settings.title}
          </h2>
          {settings.description && (
            <p className="mt-4 font-body text-warm-500 max-w-xl leading-relaxed text-sm">
              {settings.description}
            </p>
          )}
        </div>

        {/* Article list */}
        <div
          ref={scrollRef}
          className="scrollbar-hide"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : posts.length > 0
              ? posts.map((post) => (
                  <div key={post._id} data-post-card>
                    <PostCard post={post} />
                  </div>
                ))
              : (
                <div className="py-16 text-center">
                  <p className="font-body text-warm-400">No articles yet</p>
                </div>
              )
          }
        </div>

        {/* Scroll buttons */}
        {hasMore && (
          <div className="flex justify-center gap-3 mt-6">
            {canScrollUp && (
              <ScrollButton
                direction="up"
                onMouseEnter={() => startScroll(-1)}
                onMouseLeave={stopScroll}
              />
            )}
            {canScrollDown && (
              <ScrollButton
                direction="down"
                onMouseEnter={() => startScroll(1)}
                onMouseLeave={stopScroll}
              />
            )}
          </div>
        )}

        {/* View All link */}
        {settings.viewAllLabel && settings.viewAllHref && (
          <div className="mt-8 text-center">
            <a
              href={settings.viewAllHref}
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-sandstone hover:text-charcoal transition-colors duration-300"
            >
              <span>{settings.viewAllLabel}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
