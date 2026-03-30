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

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();

  const [blogPost, setBlogPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  useEffect(() => {
    if (!blogPost) return;
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked') || '{}');
    if (likedPosts[id]) setLiked(true);
  }, [blogPost, id]);

  useEffect(() => {
    if (!id) return;
    const es = new EventSource('/api/blog/events');
    es.onmessage = () => { fetchPost(); fetchComments(); };
    es.onerror = () => es.close();
    return () => es.close();
  }, [id, fetchPost, fetchComments]);

  const handleLike = async () => {
    try {
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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatShort = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="text-xl font-semibold text-charcoal">Bai viet khong ton tai</h1>
        <Link href="/blog" className="mt-3 text-blue-600 hover:underline text-sm">
          Quay lai trang tin tuc
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blogPost.title} - VLXD</title>
        <meta name="description" content={blogPost.excerpt || blogPost.title} />
        {blogPost.coverImage && <meta property="og:image" content={blogPost.coverImage} />}
      </Head>

      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-[760px] px-4 py-3 flex items-center gap-2 text-sm text-charcoal/50">
            <Link href="/landing" className="hover:text-charcoal transition">Trang chu</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-charcoal transition">Tin tuc</Link>
            <span>/</span>
            <span className="text-charcoal/70 truncate">{blogPost.title}</span>
          </div>
        </div>

        {/* Article */}
        <article className="mx-auto max-w-[760px] px-4 pt-6 pb-10">
          {/* Category tags */}
          {blogPost.tags?.length > 0 && (
            <div className="flex gap-2 mb-3">
              {blogPost.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-xs font-semibold text-blue-600 uppercase tracking-wide hover:underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-[32px] font-bold text-charcoal leading-tight">
            {blogPost.title}
          </h1>

          {/* Excerpt as lead paragraph */}
          {blogPost.excerpt && (
            <p className="mt-3 text-lg text-charcoal/70 leading-relaxed font-light">
              {blogPost.excerpt}
            </p>
          )}

          {/* Meta bar */}
          <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-sm text-charcoal/50">
              {formatDate(blogPost.publishedAt || blogPost.createdAt)}
            </span>
            <div className="flex items-center gap-4 text-sm text-charcoal/50">
              <span>{blogPost.viewCount || 0} luot doc</span>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition ${liked ? 'text-red-500' : 'hover:text-red-400'}`}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>
              <span>{blogPost.commentCount || comments.length} binh luan</span>
            </div>
          </div>

          {/* Cover image */}
          {blogPost.coverImage && (
            <figure className="mt-5">
              <img
                src={blogPost.coverImage}
                alt={blogPost.title}
                className="w-full rounded-lg"
              />
            </figure>
          )}

          {/* Article content */}
          <div
            className="blog-content mt-6"
            style={{ fontSize: '18px', lineHeight: '1.8', color: '#1a1a1a' }}
            dangerouslySetInnerHTML={{ __html: transformBlogContent(blogPost.content) }}
          />

          {/* Like + share bar at bottom */}
          <div className="mt-8 flex items-center gap-4 border-t border-b border-gray-200 py-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition border ${
                liked
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-charcoal/60 border-gray-200 hover:border-charcoal/30'
              }`}
            >
              {liked ? '❤️ Da thich' : '🤍 Thich'} ({likeCount})
            </button>
          </div>

          {/* Comments */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
              Binh luan
              <span className="text-sm font-normal text-charcoal/40">({comments.length})</span>
            </h2>

            {/* Comment form */}
            <form onSubmit={handleComment} className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              {!isAuthenticated && (
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Ten cua ban (de trong = An danh)"
                  className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 transition"
                />
              )}
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Viet binh luan cua ban..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 transition resize-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !commentContent.trim()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Dang gui...' : 'Gui binh luan'}
                </button>
              </div>
            </form>

            {/* Comment list */}
            <div className="mt-5 space-y-0 divide-y divide-gray-100">
              {comments.map((comment) => (
                <div key={comment._id} className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {(comment.name || 'A')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-charcoal">{comment.name}</span>
                    <span className="text-xs text-charcoal/35">{formatShort(comment.createdAt)}</span>
                  </div>
                  <p className="mt-2 ml-10 text-sm text-charcoal/80 leading-relaxed">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="py-8 text-center text-sm text-charcoal/35">
                  Chua co binh luan. Hay la nguoi dau tien!
                </p>
              )}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
