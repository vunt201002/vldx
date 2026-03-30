import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { get } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tag, setTag] = useState('');

  const fetchPosts = () => {
    const query = tag ? `?page=${page}&limit=13&tag=${tag}` : `?page=${page}&limit=13`;
    get(`/blog${query}`)
      .then((res) => {
        setPosts(res.data || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const featured = posts[0];
  const sidePosts = posts.slice(1, 4);
  const restPosts = posts.slice(4);

  return (
    <>
      <Head>
        <title>Tin tuc - VLXD</title>
        <meta name="description" content="Tin tuc va bai viet ve vat lieu xay dung" />
      </Head>

      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/landing" className="text-charcoal/50 hover:text-charcoal text-sm transition">
                Trang chu
              </Link>
              <span className="text-charcoal/30">/</span>
              <h1 className="text-lg font-bold text-charcoal">Tin tuc</h1>
            </div>
            {tag && (
              <button
                onClick={() => { setTag(''); setPage(1); }}
                className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition"
              >
                #{tag} <span className="text-blue-400">x</span>
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-5">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-lg">
              <p className="text-lg text-charcoal/50">Chua co bai viet nao</p>
            </div>
          ) : (
            <>
              {/* Hero section — featured post + 3 side posts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                {/* Featured (large) */}
                {featured && (
                  <Link
                    href={`/blog/${featured._id}`}
                    className="lg:col-span-2 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    {featured.coverImage && (
                      <div className="relative h-56 md:h-80 overflow-hidden">
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="mt-2 text-sm text-white/80 line-clamp-2 hidden md:block">
                              {featured.excerpt}
                            </p>
                          )}
                          <span className="mt-2 inline-block text-xs text-white/60">
                            {formatDate(featured.publishedAt || featured.createdAt)}
                          </span>
                        </div>
                      </div>
                    )}
                    {!featured.coverImage && (
                      <div className="p-5">
                        <h2 className="text-xl font-bold text-charcoal group-hover:text-blue-600 transition line-clamp-2">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="mt-2 text-sm text-charcoal/60 line-clamp-2">{featured.excerpt}</p>
                        )}
                        <span className="mt-2 inline-block text-xs text-charcoal/40">
                          {formatDate(featured.publishedAt || featured.createdAt)}
                        </span>
                      </div>
                    )}
                  </Link>
                )}

                {/* Side posts (3 stacked) */}
                <div className="flex flex-col gap-4">
                  {sidePosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post._id}`}
                      className="group flex gap-3 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-3"
                    >
                      {post.coverImage && (
                        <div className="w-28 h-20 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-charcoal group-hover:text-blue-600 transition leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <span className="mt-1 block text-xs text-charcoal/40">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Rest of posts — VnExpress news feed style */}
              {restPosts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                  {restPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post._id}`}
                      className="group flex gap-4 p-4 hover:bg-gray-50 transition"
                    >
                      {post.coverImage && (
                        <div className="w-40 h-24 md:w-48 md:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-base font-semibold text-charcoal group-hover:text-blue-600 transition leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-1.5 text-sm text-charcoal/55 line-clamp-2 hidden md:block">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-charcoal/40">
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          {post.viewCount > 0 && (
                            <>
                              <span>·</span>
                              <span>{post.viewCount} luot xem</span>
                            </>
                          )}
                          {post.tags?.length > 0 && (
                            <>
                              <span>·</span>
                              {post.tags.slice(0, 2).map((t) => (
                                <button
                                  key={t}
                                  onClick={(e) => { e.preventDefault(); setTag(t); setPage(1); }}
                                  className="text-blue-500 hover:text-blue-700"
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded text-sm font-medium transition ${
                        page === p
                          ? 'bg-charcoal text-white'
                          : 'bg-white text-charcoal/70 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
