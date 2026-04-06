import fs from 'fs';
import path from 'path';

const DATA_MODE = process.env.DATA_MODE || 'api';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
const CONFIG_DIR = path.join(process.cwd(), 'config');

/**
 * Catch-all API route for static data mode.
 * In static mode, serves read-only data from JSON files.
 * Write operations (POST/PUT/DELETE) and unhandled routes proxy to backend.
 * In api mode, this route is not reached (next.config.js rewrites handle it).
 */
export default async function handler(req, res) {
  const apiPath = '/' + (req.query.path || []).join('/');

  // In api mode, rewrites handle /api/* — this shouldn't be reached
  // but if it is, proxy to backend
  if (DATA_MODE !== 'static') {
    return proxyToBackend(req, res, apiPath);
  }

  // Static mode: only serve GET requests from JSON
  if (req.method === 'GET') {
    const result = serveFromStatic(apiPath, req.query);
    if (result) {
      return res.status(200).json(result);
    }
  }

  // Writes and unhandled routes: proxy to backend if available
  return proxyToBackend(req, res, apiPath);
}

function serveFromStatic(apiPath, query) {
  // GET /theme/active
  if (apiPath === '/theme/active') {
    return readJson('theme.json');
  }

  // GET /theme/pages/:slug
  const pageMatch = apiPath.match(/^\/theme\/pages\/(.+)$/);
  if (pageMatch) {
    return readJson(`pages/${pageMatch[1]}.json`);
  }

  // GET /blog/tags
  if (apiPath === '/blog/tags') {
    return readJson('blog-tags.json');
  }

  // GET /blog/:id
  const blogDetailMatch = apiPath.match(/^\/blog\/([a-f0-9]{24})$/);
  if (blogDetailMatch) {
    return readJson(`blog/${blogDetailMatch[1]}.json`);
  }

  // GET /blog (with pagination/tag filtering)
  if (apiPath === '/blog') {
    return serveBlogList(query);
  }

  // GET /products/slug/:slug
  const productSlugMatch = apiPath.match(/^\/products\/slug\/(.+)$/);
  if (productSlugMatch) {
    return readJson(`products/${productSlugMatch[1]}.json`);
  }

  // GET /products
  if (apiPath === '/products') {
    return readJson('products.json');
  }

  return null;
}

function serveBlogList(query) {
  const data = readJson('blog.json');
  if (!data) return null;

  let posts = data.data || [];

  // Filter by tag
  if (query.tag) {
    posts = posts.filter((p) => p.tags && p.tags.includes(query.tag));
  }

  // Paginate
  const limit = Math.min(parseInt(query.limit) || 12, 50);
  const page = Math.max(parseInt(query.page) || 1, 1);
  const total = posts.length;
  const start = (page - 1) * limit;
  const paged = posts.slice(start, start + limit);

  return {
    success: true,
    data: paged,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

function readJson(filename) {
  const filePath = path.join(CONFIG_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function proxyToBackend(req, res, apiPath) {
  try {
    const url = new URL(apiPath, BACKEND_URL);
    // Forward query params
    Object.entries(req.query).forEach(([key, val]) => {
      if (key !== 'path') url.searchParams.set(key, val);
    });

    const headers = { ...req.headers };
    delete headers.host;

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const backendRes = await fetch(url.toString(), fetchOptions);
    const contentType = backendRes.headers.get('content-type');
    const body = contentType?.includes('application/json')
      ? await backendRes.json()
      : await backendRes.text();

    res.status(backendRes.status);
    if (typeof body === 'string') {
      res.send(body);
    } else {
      res.json(body);
    }
  } catch (err) {
    res.status(502).json({ success: false, message: 'Backend unavailable' });
  }
}
