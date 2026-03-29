import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { get, post } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { transformBlogContent } from '@/lib/transformBlogContent';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('blog_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('blog_session_id', id);
  }
  return id;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();

  const [blogPost, setBlogPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  // Check if already liked
  useEffect(() => {
    if (!blogPost) return;
    const sessionId = getSessionId();
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

      // Track in localStorage
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
      fetchComments();
    } catch {}
    setSubmitting(false);
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
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream">
        <h1 className="text-2xl font-semibold text-charcoal">Bai viet khong ton tai</h1>
        <Link href="/blog" className="mt-4 text-charcoal/60 hover:text-charcoal transition">
          ← Quay lai Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blogPost.title} - VLXD Blog</title>
        <meta name="description" content={blogPost.excerpt || blogPost.title} />
        {blogPost.coverImage && <meta property="og:image" content={blogPost.coverImage} />}
      </Head>

      <div className="min-h-screen bg-cream">
        {/* Cover image */}
        {blogPost.coverImage && (
          <div className="h-64 w-full md:h-96">
            <img
              src={blogPost.coverImage}
              alt={blogPost.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Article */}
        <article className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          {/* Back link */}
          <Link href="/blog" className="text-sm text-charcoal/50 hover:text-charcoal transition">
            ← Quay lai Blog
          </Link>

          {/* Title */}
          <h1 className="mt-6 text-3xl font-bold text-charcoal md:text-4xl leading-tight">
            {blogPost.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-charcoal/50">
            <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
            <span>·</span>
            <span>{blogPost.viewCount || 0} luot xem</span>
            <span>·</span>
            <span>{blogPost.commentCount || comments.length} binh luan</span>
          </div>

          {/* Tags */}
          {blogPost.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blogPost.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="rounded-full bg-charcoal/5 px-3 py-1 text-xs font-medium text-charcoal/70 hover:bg-charcoal/10 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="blog-content mt-8 prose prose-lg max-w-none text-charcoal/90"
            dangerouslySetInnerHTML={{ __html: transformBlogContent(blogPost.content) }}
          />

          {/* Like button */}
          <div className="mt-10 flex items-center gap-3 border-t border-b border-charcoal/10 py-5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                liked
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10 border border-transparent'
              }`}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span>{liked ? 'Da thich' : 'Thich'}</span>
            </button>
            <span className="text-sm text-charcoal/50">{likeCount} luot thich</span>
          </div>

          {/* Comments section */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-charcoal">
              Binh luan ({comments.length})
            </h2>

            {/* Comment form */}
            <form onSubmit={handleComment} className="mt-6 space-y-4">
              {!isAuthenticated && (
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Ten cua ban (de trong se hien thi An danh)"
                  className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
                />
              )}
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Viet binh luan..."
                rows={3}
                className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-charcoal/40 resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-charcoal/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Dang gui...' : 'Gui binh luan'}
              </button>
            </form>

            {/* Comments list */}
            <div className="mt-8 space-y-5">
              {comments.map((comment) => (
                <div key={comment._id} className="rounded-lg bg-white p-4 border border-charcoal/8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/10 text-xs font-bold text-charcoal/60">
                      {(comment.name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-charcoal">{comment.name}</span>
                      <span className="ml-2 text-xs text-charcoal/40">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="py-6 text-center text-sm text-charcoal/40">
                  Chua co binh luan nao. Hay la nguoi dau tien binh luan!
                </p>
              )}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
