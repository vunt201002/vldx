// Server-side: call backend directly — Next.js rewrites only work client-side
// Client-side: use /api which proxies to backend via next.config.js rewrites
const BASE =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    : '/api';

// In-memory ETag cache: url → { etag, data }
const etagCache = new Map();

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const isGet = !options.method || options.method === 'GET';
  const cached = isGet ? etagCache.get(url) : null;

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (cached) headers['If-None-Match'] = cached.etag;

  const res = await fetch(url, { ...options, headers });

  if (isGet && res.status === 304 && cached) {
    return cached.data;
  }

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  const data = contentType?.includes('application/json')
    ? await res.json()
    : await res.text();

  const etag = res.headers.get('etag');
  if (isGet && etag) etagCache.set(url, { etag, data });

  return data;
}

export async function get(path) {
  return request(path, { method: 'GET' });
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function del(path) {
  return request(path, { method: 'DELETE' });
}
