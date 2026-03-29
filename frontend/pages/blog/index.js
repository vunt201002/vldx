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

  const fetchPosts = async () => {
    try {
      const query = tag ? `?page=${page}&tag=${tag}` : `?page=${page}`;
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

  // SSE: real-time updates when admin publishes/edits
  useEffect(() => {
    const es = new EventSource('/api/blog/events');
    es.onmessage = () => fetchPosts();
    es.onerror = () => es.close();
    return () => es.close();
  }, [page, tag]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Blog - VLXD</title>
        <meta name="description" content="Tin tuc va bai viet ve vat lieu xay dung" />
      </Head>

      <div className="min-h-screen bg-cream">
        {/* Header */}
        <div className="bg-charcoal text-cream">
          <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
            <Link href="/landing" className="text-sm text-cream/60 hover:text-cream transition">
              ← Trang chu
            </Link>
            <h1 className="mt-4 text-4xl font-light md:text-5xl">Blog</h1>
            <p className="mt-3 text-lg text-cream/70">
              Tin tuc, huong dan va chia se ve vat lieu xay dung
            </p>
          </div>
        </div>

        {/* Tag filter */}
        {tag && (
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-charcoal/10 px-4 py-1.5 text-sm">
              Tag: <strong>{tag}</strong>
              <button onClick={() => { setTag(''); setPage(1); }} className="text-charcoal/50 hover:text-charcoal">
                x
              </button>
            </span>
          </div>
        )}

        {/* Posts */}
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-charcoal/50">
              <p className="text-xl">Chua co bai viet nao</p>
              <p className="mt-2">Hay quay lai sau nhe!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  className="group block overflow-hidden rounded-lg border border-charcoal/10 bg-white transition hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Cover image */}
                    {post.coverImage && (
                      <div className="h-48 w-full flex-shrink-0 md:h-auto md:w-64">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                      <div>
                        <h2 className="text-xl font-semibold text-charcoal group-hover:text-charcoal/70 transition md:text-2xl">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2 text-charcoal/60 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-3 text-sm text-charcoal/50">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        <span>·</span>
                        <span>{post.viewCount || 0} luot xem</span>
                        {post.tags?.length > 0 && (
                          <>
                            <span>·</span>
                            <div className="flex gap-1.5">
                              {post.tags.slice(0, 3).map((t) => (
                                <button
                                  key={t}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setTag(t);
                                    setPage(1);
                                  }}
                                  className="rounded-full bg-charcoal/5 px-2.5 py-0.5 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 transition"
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Trang truoc
              </button>
              <span className="flex items-center px-4 text-sm text-charcoal/60">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
