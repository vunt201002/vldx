// Server-side (getStaticProps): call backend directly — Next.js rewrites only work client-side
// Client-side: use /api which proxies to backend via next.config.js rewrites
const BASE =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    : '/api';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
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
