import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { get } from '@/lib/api';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const ms = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'Vua xong';
  if (minutes < 60) return `${minutes} phut truoc`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} gio truoc`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngay truoc`;
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tag, setTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [moreOpen, setMoreOpen] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await get('/blog/tags');
      setTags(res.data || []);
    } catch {
      setTags([]);
    }
  };

  const fetchPosts = async () => {
    try {
      const query = tag ? `?page=${page}&limit=12&tag=${tag}` : `?page=${page}&limit=12`;
      const res = await get(`/blog${query}`);
      setPosts(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [page, tag]);

  useEffect(() => {
    const es = new EventSource('/api/blog/events');
    es.onmessage = () => fetchPosts();
    es.onerror = () => es.close();
    return () => es.close();
  }, [page, tag]);

  const featured = !tag && page === 1 && posts.length > 0 ? posts[0] : null;
  const sidePosts = !tag && page === 1 ? posts.slice(1, 4) : [];
  const feedPosts = !tag && page === 1 ? posts.slice(4) : posts;

  return (
    <>
      <Head>
        <title>{tag ? `#${tag} - Tin tuc VLXD` : 'Tin tuc - VLXD'}</title>
        <meta name="description" content="Tin tuc va bai viet ve vat lieu xay dung" />
      </Head>

      <div className="min-h-screen" style={{ background: '#fff', fontFamily: "var(--wsj-sans, 'Arial Narrow', Arial, sans-serif)" }}>
        {/* Masthead — WSJ-style centered logo */}
        <div className="text-center py-5">
          <Link href="/landing">
            <span style={{
              fontFamily: 'var(--wsj-serif)',
              fontSize: '32px',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'var(--wsj-text)',
              letterSpacing: '-0.01em',
            }}>
              Vat Lieu Xay Dung
            </span>
          </Link>
        </div>

        {/* Category nav bar — WSJ style */}
        <div>
          <div className="mx-auto max-w-[1200px] px-4 flex items-center justify-center gap-4 sm:gap-6 py-2.5 relative" style={{ fontSize: '13px', fontFamily: 'var(--wsj-sans)', color: '#333' }}>
            {/* Mobile: first 4, Desktop: first 8 */}
            {tags.slice(0, 3).map((t) => (
              <button
                key={t}
                onClick={() => { setTag(t); setPage(1); setMoreOpen(false); }}
                className="hover:underline transition whitespace-nowrap capitalize"
                style={{ fontWeight: tag === t ? 700 : 400 }}
              >
                {t}
              </button>
            ))}
            {tags.slice(3, 8).map((t) => (
              <button
                key={t}
                onClick={() => { setTag(t); setPage(1); setMoreOpen(false); }}
                className="hidden sm:block hover:underline transition whitespace-nowrap capitalize"
                style={{ fontWeight: tag === t ? 700 : 400 }}
              >
                {t}
              </button>
            ))}
            {/* "More" dropdown — visible on mobile when >4 tags, on desktop when >8 */}
            {tags.length > 3 && (
              <div className={`relative ${tags.length <= 8 ? 'sm:hidden' : ''}`}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="hover:underline transition whitespace-nowrap flex items-center gap-1"
                >
                  Xem them
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={moreOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                  </svg>
                </button>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 z-20 bg-white shadow-lg border py-2 min-w-[160px] max-h-[240px] overflow-y-auto" style={{ fontSize: '13px' }}>
                      {tags.slice(3).map((t, i) => (
                        <button
                          key={t}
                          onClick={() => { setTag(t); setPage(1); setMoreOpen(false); }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-50 capitalize transition ${i < 5 ? 'sm:hidden' : ''}`}
                          style={{ fontWeight: tag === t ? 700 : 400, color: '#333' }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="ml-2 hover:opacity-70 transition"
              style={{ color: '#333' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="mx-auto max-w-[1200px] px-4 pb-3">
              <div className="flex items-center gap-2" style={{ borderBottom: '2px solid var(--wsj-text)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setTag(searchQuery.trim().toLowerCase());
                      setPage(1);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  placeholder="Tim kiem bai viet..."
                  autoFocus
                  className="flex-1 py-2 text-sm outline-none"
                  style={{ fontFamily: 'var(--wsj-sans)', color: 'var(--wsj-text)', background: 'transparent' }}
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-sm hover:opacity-70"
                  style={{ color: '#999' }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section heading with full-width rules */}
        <div className="mx-auto max-w-[1200px] px-4">
          <div style={{ borderBottom: '1px solid #ccc', marginTop: '12px' }} />
          <h1 className="wsj-title text-center py-4" style={{ fontSize: '48px' }}>
            {tag ? `#${tag}` : 'Tin tuc'}
          </h1>
          <div style={{ borderBottom: '1px solid #ccc' }} />
          {tag && (
            <div className="text-center pt-3">
              <button
                onClick={() => { setTag(''); setPage(1); }}
                className="text-sm transition hover:underline"
                style={{ color: 'var(--wsj-teal)', fontFamily: 'var(--wsj-sans)' }}
              >
                ✕ Xoa bo loc: #{tag}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[1200px] px-4 pb-12 mt-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#ddd', borderTopColor: '#333' }} />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p style={{ color: '#999', fontFamily: 'var(--wsj-serif)', fontSize: '20px' }}>Chua co bai viet nao</p>
              <p className="mt-2 text-sm" style={{ color: '#bbb' }}>Hay quay lai sau nhe!</p>
            </div>
          ) : (
            <>
              {/* HERO — WSJ style: image left, text right, side-by-side */}
              {featured && (
                <div className="pb-8 mb-6" style={{ borderBottom: '2px solid #ddd' }}>
                  <Link href={`/blog/${featured._id}`} className="group grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Large image */}
                    <div className="lg:col-span-3">
                      {featured.coverImage && (
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full object-cover"
                          style={{ height: '380px' }}
                        />
                      )}
                    </div>
                    {/* Article info */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                      {featured.tags?.[0] && (
                        <span className="wsj-category">{featured.tags[0]}</span>
                      )}
                      <h2 className="wsj-title mt-2 group-hover:underline decoration-1 underline-offset-4" style={{ fontSize: '26px' }}>
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="wsj-excerpt mt-3 line-clamp-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                          {featured.excerpt}
                        </p>
                      )}
                      <span className="wsj-timestamp mt-3 block">
                        {formatTimeAgo(featured.publishedAt || featured.createdAt)}
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* FEED — WSJ style: image left, text right */}
              {(sidePosts.length > 0 || feedPosts.length > 0) && (
                <div>
                  {[...sidePosts, ...feedPosts].map((p) => (
                    <Link
                      key={p._id}
                      href={`/blog/${p._id}`}
                      className="group flex flex-col sm:flex-row gap-5 py-6"
                      style={{ borderBottom: '2px solid #ddd' }}
                    >
                      {p.coverImage && (
                        <div className="w-full sm:w-[250px] h-[180px] sm:h-[160px] flex-shrink-0 overflow-hidden">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {p.tags?.[0] && (
                          <span className="wsj-category">{p.tags[0]}</span>
                        )}
                        <h3 className="wsj-title mt-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-4" style={{ fontSize: '22px' }}>
                          {p.title}
                        </h3>
                        {p.excerpt && (
                          <p className="wsj-excerpt mt-2 line-clamp-2" style={{ fontSize: '15px', lineHeight: '1.5' }}>
                            {p.excerpt}
                          </p>
                        )}
                        <span className="wsj-timestamp mt-2 block">
                          {formatTimeAgo(p.publishedAt || p.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination — minimal WSJ style */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-1" style={{ fontFamily: 'var(--wsj-sans)' }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 text-sm transition disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
                    style={{ color: 'var(--wsj-text)' }}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 text-sm transition"
                      style={{
                        color: 'var(--wsj-text)',
                        fontWeight: page === p ? '700' : '400',
                        textDecoration: page === p ? 'underline' : 'none',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-2 text-sm transition disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
                    style={{ color: 'var(--wsj-text)' }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
