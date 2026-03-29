const BASE = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  })

  // Redirect to login on 401
  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    throw new Error('Authentication required')
  }

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText)
    throw new Error(error || `HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export async function get(path) {
  return request(path, { method: 'GET' })
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function del(path) {
  return request(path, { method: 'DELETE' })
}
