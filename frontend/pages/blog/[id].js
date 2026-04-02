import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { get, post } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { transformBlogContent } from '@/lib/transformBlogContent';
import { trackBlogView, trackBlogComment, trackBlogLike } from '@/lib/analytics';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('blog_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('blog_session_id', id);
  }
  return id;
}

function estimateReadTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

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

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();

  const [blogPost, setBlogPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shared, setShared] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  // Comment form
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    try {
      const res = await get(`/blog/${id}`);
      setBlogPost(res.data);
      setLikeCount(res.data.likeCount || 0);
      trackBlogView(id, res.data.title, `/blog/${id}`);
    } catch {
      setBlogPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await get(`/blog/${id}/comments`);
      setComments(res.data || []);
    } catch {
      setComments([]);
    }
  }, [id]);

  // Fetch related + popular posts
  useEffect(() => {
    if (!id) return;
    get('/blog?limit=20').then((res) => {
      const all = res.data || [];
      const filtered = all.filter((p) => p._id !== id);
      setRelatedPosts(filtered.slice(0, 4));
      setPopularPosts([...filtered].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5));
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  // Check if already liked
  useEffect(() => {
    if (!blogPost) return;
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked') || '{}');
    if (likedPosts[id]) setLiked(true);
  }, [blogPost, id]);

  // SSE: real-time updates
  useEffect(() => {
    if (!id) return;
    const es = new EventSource('/api/blog/events');
    es.onmessage = () => {
      fetchPost();
      fetchComments();
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [id, fetchPost, fetchComments]);

  const handleLike = async () => {
    try {
      const headers = {};
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const body = isAuthenticated ? {} : { sessionId: getSessionId() };
      const res = await post(`/blog/${id}/likes`, body);

      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
      if (res.data.liked && blogPost) trackBlogLike(id, blogPost.title);

      const likedPosts = JSON.parse(localStorage.getItem('blog_liked') || '{}');
      if (res.data.liked) likedPosts[id] = true;
      else delete likedPosts[id];
      localStorage.setItem('blog_liked', JSON.stringify(likedPosts));
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setSubmitting(true);

    try {
      const body = { content: commentContent.trim() };
      if (!isAuthenticated && commentName.trim()) body.name = commentName.trim();

      await post(`/blog/${id}/comments`, body);
      setCommentContent('');
      setCommentName('');
      if (blogPost) trackBlogComment(id, blogPost.title);
      fetchComments();
    } catch {}
    setSubmitting(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }).catch(() => {});
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#fff' }}>
        <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: 'var(--wsj-divider)', borderTopColor: 'var(--wsj-text)' }} />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: '#fff' }}>
        <h1 className="wsj-title text-2xl">Bai viet khong ton tai</h1>
        <Link href="/blog" className="mt-4 text-sm transition hover:underline" style={{ color: 'var(--wsj-teal)' }}>
          ← Quay lai Tin tuc
        </Link>
      </div>
    );
  }

  const readTime = estimateReadTime(blogPost.content);

  return (
    <>
      <Head>
        <title>{blogPost.title} - VLXD</title>
        <meta name="description" content={blogPost.excerpt || blogPost.title} />
        {blogPost.coverImage && <meta property="og:image" content={blogPost.coverImage} />}
      </Head>

      <div className="min-h-screen" style={{ background: '#fff' }}>
        {/* Top nav bar */}
        <div style={{ borderBottom: '1px solid var(--wsj-divider)' }}>
          <div className="mx-auto max-w-[1100px] px-4 flex items-center justify-between" style={{ height: '48px' }}>
            <Link href="/blog" className="text-sm transition hover:underline" style={{ color: '#888', fontFamily: 'var(--wsj-sans)' }}>
              ← Quay lai
            </Link>
            <span className="text-xs hidden md:block" style={{ color: '#999', fontFamily: 'var(--wsj-sans)' }}>
              {readTime} phut doc
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="mx-auto max-w-[1100px] px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main article */}
          <article className="min-w-0">
            {/* Category */}
            {blogPost.tags?.[0] && (
              <Link href={`/blog?tag=${blogPost.tags[0]}`} className="wsj-category hover:underline">
                {blogPost.tags[0]}
              </Link>
            )}

            {/* Title */}
            <h1 className="wsj-title mt-3" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            {blogPost.excerpt && (
              <p className="wsj-excerpt mt-4" style={{ fontSize: '18px' }}>
                {blogPost.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-4 text-sm" style={{ color: '#888', fontFamily: 'var(--wsj-sans)' }}>
              Cap nhat {formatDate(blogPost.publishedAt || blogPost.createdAt)}
              {blogPost.viewCount > 0 && ` · ${blogPost.viewCount} luot xem`}
            </div>

            {/* Action bar */}
            <div className="mt-4 flex items-center gap-4 py-3" style={{ borderTop: '1px solid var(--wsj-divider)', borderBottom: '1px solid var(--wsj-divider)' }}>
              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm transition hover:underline"
                style={{ color: 'var(--wsj-text)', fontFamily: 'var(--wsj-sans)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {shared ? 'Da sao!' : 'Chia se'}
              </button>

              {/* Like */}
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 text-sm transition hover:underline"
                style={{ color: liked ? '#dc2626' : 'var(--wsj-text)', fontFamily: 'var(--wsj-sans)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>

              {/* Read time (mobile) */}
              <span className="wsj-timestamp md:hidden ml-auto">{readTime} phut doc</span>
            </div>

            {/* Cover image */}
            {blogPost.coverImage && (
              <figure className="mt-6">
                <img src={blogPost.coverImage} alt={blogPost.title} className="w-full" />
              </figure>
            )}

            {/* Author */}
            <p className="mt-4 text-sm font-bold" style={{ color: 'var(--wsj-text)', fontFamily: 'var(--wsj-sans)' }}>
              Boi VLXD
            </p>

            {/* Content */}
            <div
              className="blog-content mt-6"
              dangerouslySetInnerHTML={{ __html: transformBlogContent(blogPost.content) }}
            />

            {/* Tags at bottom */}
            {blogPost.tags?.length > 1 && (
              <div className="mt-8 flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid var(--wsj-divider)' }}>
                {blogPost.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${t}`}
                    className="text-xs px-3 py-1 transition hover:underline"
                    style={{ color: 'var(--wsj-teal)', fontFamily: 'var(--wsj-sans)', border: '1px solid var(--wsj-divider)' }}
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Comments section */}
            <section className="mt-12 pt-8" style={{ borderTop: '2px solid var(--wsj-text)' }}>
              <h2 className="wsj-title" style={{ fontSize: '22px' }}>
                Binh luan ({comments.length})
              </h2>

              <form onSubmit={handleComment} className="mt-6 space-y-3">
                {!isAuthenticated && (
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Ten cua ban (de trong se hien thi An danh)"
                    className="w-full px-4 py-3 text-sm outline-none transition"
                    style={{ border: '1px solid var(--wsj-divider)', fontFamily: 'var(--wsj-sans)', background: '#fff' }}
                  />
                )}
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Viet binh luan..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm outline-none transition resize-none"
                  style={{ border: '1px solid var(--wsj-divider)', fontFamily: 'var(--wsj-sans)', background: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={submitting || !commentContent.trim()}
                  className="px-6 py-2.5 text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--wsj-text)', color: '#fff', fontFamily: 'var(--wsj-sans)' }}
                >
                  {submitting ? 'Dang gui...' : 'Gui binh luan'}
                </button>
              </form>

              <div className="mt-8 space-y-0">
                {comments.map((comment) => (
                  <div key={comment._id} className="py-4" style={{ borderBottom: '1px solid var(--wsj-divider)' }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: '#f0f0f0', color: '#666' }}
                      >
                        {(comment.name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--wsj-text)', fontFamily: 'var(--wsj-sans)' }}>
                        {comment.name}
                      </span>
                      <span className="text-xs" style={{ color: '#999', fontFamily: 'var(--wsj-sans)' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--wsj-text-secondary)', fontFamily: 'var(--wsj-sans)' }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="py-6 text-center text-sm" style={{ color: '#999', fontFamily: 'var(--wsj-sans)' }}>
                    Chua co binh luan nao. Hay la nguoi dau tien binh luan!
                  </p>
                )}
              </div>
            </section>

            {/* What to Read Next */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8" style={{ borderTop: '2px solid var(--wsj-text)' }}>
                <h2 className="wsj-title mb-6" style={{ fontSize: '22px' }}>Doc tiep</h2>
                <div>
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp._id}
                      href={`/blog/${rp._id}`}
                      className="group flex flex-col sm:flex-row gap-4 py-5"
                      style={{ borderBottom: '1px solid var(--wsj-divider)' }}
                    >
                      {rp.coverImage && (
                        <div className="w-full sm:w-[180px] h-[140px] sm:h-[110px] flex-shrink-0 overflow-hidden">
                          <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {rp.tags?.[0] && <span className="wsj-category">{rp.tags[0]}</span>}
                        <h3 className="wsj-title mt-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-4" style={{ fontSize: '17px' }}>
                          {rp.title}
                        </h3>
                        {rp.excerpt && (
                          <p className="wsj-excerpt mt-1.5 text-sm line-clamp-2">{rp.excerpt}</p>
                        )}
                        <span className="wsj-timestamp mt-2 block">
                          {formatTimeAgo(rp.publishedAt || rp.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar: Most Popular */}
          <aside className="hidden lg:block">
            <div className="sticky" style={{ top: '24px' }}>
              {popularPosts.length > 0 && (
                <>
                  <h3 className="wsj-title pb-3 mb-0" style={{ fontSize: '18px', borderBottom: '2px solid var(--wsj-text)' }}>
                    Xem nhieu nhat
                  </h3>
                  <ol>
                    {popularPosts.map((p, i) => (
                      <li key={p._id} className="py-4" style={{ borderBottom: '1px solid var(--wsj-divider)' }}>
                        <Link href={`/blog/${p._id}`} className="flex gap-3 group">
                          <span className="text-2xl font-bold flex-shrink-0" style={{ color: '#ddd', fontFamily: 'var(--wsj-serif)', width: '24px' }}>
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            {p.tags?.[0] && <span className="wsj-category" style={{ fontSize: '10px' }}>{p.tags[0]}</span>}
                            <h4 className="wsj-title mt-0.5 line-clamp-3 group-hover:underline decoration-1 underline-offset-4" style={{ fontSize: '15px' }}>
                              {p.title}
                            </h4>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
