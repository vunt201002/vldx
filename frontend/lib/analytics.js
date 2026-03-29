/**
 * Client-side analytics tracking.
 * Fire-and-forget — never blocks page load or throws errors.
 */

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('analytics_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('analytics_session_id', id);
  }
  return id;
}

export function trackEvent(type, data = {}) {
  if (typeof window === 'undefined') return;

  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      sessionId: getSessionId(),
      ...data,
    }),
  }).catch(() => {}); // Silent fail
}

export function trackPageView(path) {
  trackEvent('page_view', { path });
}

export function trackProductView(productId, productName, path) {
  trackEvent('product_view', { path, referenceId: productId, referenceName: productName });
}

export function trackBlogView(blogId, blogTitle, path) {
  trackEvent('blog_view', { path, referenceId: blogId, referenceName: blogTitle });
}

export function trackColorSelect(colorName, hex) {
  trackEvent('color_select', { path: window.location.pathname, metadata: { colorName, hex } });
}
