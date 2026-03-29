/**
 * Transforms blog HTML content for public rendering.
 * - Converts raw YouTube URLs (in text or links) to embedded iframes
 * - Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 */

export function transformBlogContent(html) {
  if (!html) return '';

  // Replace YouTube URLs that are NOT already inside an iframe src
  // Match URLs in <a> tags, plain text, or <p> tags
  let result = html;

  // 1. Replace <a> tags that link to YouTube with iframes
  result = result.replace(
    /<a[^>]*href="([^"]*(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})[^"]*)"[^>]*>.*?<\/a>/gi,
    (_, _url, videoId) => makeIframe(videoId),
  );

  // 2. Replace standalone YouTube URLs in text (not already in iframe/src)
  result = result.replace(
    /(<p>|<br\/?>|^|\n)\s*((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^\s<]*)\s*(<\/p>|<br\/?>|$|\n)/gi,
    (_, before, _url, videoId, after) => `${before}${makeIframe(videoId)}${after}`,
  );

  return result;
}

function makeIframe(videoId) {
  return `<div class="blog-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
