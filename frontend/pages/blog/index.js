import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { get } from '@/lib/api';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const ms = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
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
        <title>{tag ? `#${tag} - VLXD News` : 'News - VLXD'}</title>
        <meta name="description" content="News and articles about construction materials" />
      </Head>

      <div className="min-h-screen" style={{ background: '#f5f5f5', fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
        {/* Header with logo */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="flex items-center justify-between" style={{ height: '60px' }}>
              <Link href="/landing" className="flex items-center gap-2">
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  VL<span style={{ color: '#b80000' }}>X</span>D
                </span>
                <span style={{ fontSize: '11px', color: '#999', borderLeft: '1px solid #ddd', paddingLeft: '8px', lineHeight: 1.3 }}>
                  Construction<br />Materials
                </span>
              </Link>
              <div className="flex items-center gap-4">
                {tag && (
                  <button
                    onClick={() => { setTag(''); setPage(1); }}
                    className="flex items-center gap-1.5 text-sm px-3 py-1 rounded transition"
                    style={{ background: '#fff3f3', color: '#b80000', border: '1px solid #ffcdd2' }}
                  >
                    #{tag} <span style={{ color: '#e57373' }}>✕</span>
                  </button>
                )}
                <Link href="/landing" className="text-sm transition hidden md:block" style={{ color: '#888' }}>
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-5">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300" style={{ borderTopColor: '#b80000' }}></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center rounded-lg" style={{ background: '#fff' }}>
              <p className="text-lg" style={{ color: '#999' }}>No articles yet</p>
              <p className="mt-1 text-sm" style={{ color: '#bbb' }}>Please check back later!</p>
            </div>
          ) : (
            <>
              {/* Featured hero + side posts */}
              {featured && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-5 rounded-lg overflow-hidden" style={{ background: '#fff' }}>
                  {/* Hero */}
                  <Link href={`/blog/${featured._id}`} className="lg:col-span-2 group relative block overflow-hidden">
                    {featured.coverImage ? (
                      <div className="relative" style={{ height: '420px' }}>
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-2xl md:text-[28px] font-bold text-white leading-tight line-clamp-3 group-hover:underline decoration-1 underline-offset-4">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="mt-2.5 text-[15px] text-white/75 line-clamp-2 hidden md:block leading-relaxed">
                              {featured.excerpt}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                            <span>{formatTimeAgo(featured.publishedAt || featured.createdAt)}</span>
                            {featured.viewCount > 0 && <><span>·</span><span>{featured.viewCount} views</span></>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <h2 className="text-2xl font-bold group-hover:underline" style={{ color: '#1a1a1a' }}>{featured.title}</h2>
                        {featured.excerpt && <p className="mt-2 text-sm" style={{ color: '#666' }}>{featured.excerpt}</p>}
                      </div>
                    )}
                  </Link>

                  {/* Side posts */}
                  {sidePosts.length > 0 && (
                    <div className="hidden lg:flex flex-col" style={{ borderLeft: '1px solid #eee' }}>
                      {sidePosts.map((sp, i) => (
                        <Link
                          key={sp._id}
                          href={`/blog/${sp._id}`}
                          className="group flex-1 flex flex-col justify-center px-5 py-4 transition hover:bg-gray-50"
                          style={{ borderBottom: i < sidePosts.length - 1 ? '1px solid #eee' : 'none' }}
                        >
                          <div className="flex gap-3">
                            {sp.coverImage && (
                              <div className="w-[100px] h-[68px] flex-shrink-0 rounded overflow-hidden">
                                <img src={sp.coverImage} alt={sp.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-red-800 transition" style={{ color: '#1a1a1a' }}>
                                {sp.title}
                              </h3>
                              <span className="mt-1.5 block text-xs" style={{ color: '#999' }}>
                                {formatTimeAgo(sp.publishedAt || sp.createdAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* News feed */}
              {feedPosts.length > 0 && (
                <div className="rounded-lg overflow-hidden" style={{ background: '#fff' }}>
                  {feedPosts.map((p, i) => (
                    <Link
                      key={p._id}
                      href={`/blog/${p._id}`}
                      className="group flex gap-4 md:gap-5 p-4 md:p-5 transition hover:bg-gray-50"
                      style={{ borderBottom: i < feedPosts.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                    >
                      {p.coverImage && (
                        <div className="w-[140px] h-[90px] md:w-[200px] md:h-[130px] flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-red-800 transition" style={{ color: '#1a1a1a' }}>
                            {p.title}
                          </h3>
                          {p.excerpt && (
                            <p className="mt-1.5 text-[14px] line-clamp-2 hidden md:block leading-relaxed" style={{ color: '#666' }}>
                              {p.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: '#999' }}>
                          <span>{formatTimeAgo(p.publishedAt || p.createdAt)}</span>
                          {p.viewCount > 0 && <><span>·</span><span>{p.viewCount} views</span></>}
                          {p.tags?.length > 0 && (
                            <>
                              <span>·</span>
                              {p.tags.slice(0, 2).map((t) => (
                                <button
                                  key={t}
                                  onClick={(e) => { e.preventDefault(); setTag(t); setPage(1); }}
                                  className="hover:underline"
                                  style={{ color: '#b80000' }}
                                >
                                  #{t}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: '#fff', color: '#333', border: '1px solid #ddd' }}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded text-sm font-medium transition"
                      style={{
                        background: page === p ? '#b80000' : '#fff',
                        color: page === p ? '#fff' : '#333',
                        border: page === p ? '1px solid #b80000' : '1px solid #ddd',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-2 rounded text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: '#fff', color: '#333', border: '1px solid #ddd' }}
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
