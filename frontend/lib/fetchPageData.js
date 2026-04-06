import fs from 'fs';
import path from 'path';
import { transformPageData } from './transformPageConfig';

const DATA_MODE = process.env.DATA_MODE || 'api';
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';
const configDir = path.join(process.cwd(), 'config');

/**
 * Fetch page data from either API or static JSON files,
 * based on the DATA_MODE env variable.
 *
 * Returns { globalTheme, pageConfig } or { notFound: true }.
 */
export async function fetchPageData(slug) {
  if (DATA_MODE === 'static') {
    return fetchFromStatic(slug);
  }
  return fetchFromApi(slug);
}

/**
 * Fetch global theme data (header/footer).
 * Used by product pages and other non-CMS pages.
 */
export async function fetchThemeData() {
  if (DATA_MODE === 'static') {
    return readJson('theme.json');
  }
  const res = await fetch(`${apiBase}/theme/active`);
  const data = await res.json();
  return data.data || null;
}

/**
 * Fetch any static data — reads from JSON file in static mode,
 * fetches from API in api mode.
 *
 * @param {string} jsonFile - Path relative to config/ (e.g. 'products.json', 'blog/123.json')
 * @param {string} apiPath - API path (e.g. '/products?published=true')
 * @returns {object|null} The parsed data
 */
export async function fetchStaticData(jsonFile, apiPath) {
  if (DATA_MODE === 'static') {
    return readJson(jsonFile);
  }
  const res = await fetch(`${apiBase}${apiPath}`);
  if (!res.ok) return null;
  return res.json();
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function fetchFromApi(slug) {
  const [themeRes, pageRes] = await Promise.all([
    fetch(`${apiBase}/theme/active`),
    fetch(`${apiBase}/theme/pages/${slug}`)
  ]);

  if (!pageRes.ok) return { notFound: true };

  const themeData = await themeRes.json();
  const pageData = await pageRes.json();

  return {
    globalTheme: themeData.data,
    pageConfig: transformPageData(pageData.data),
  };
}

function fetchFromStatic(slug) {
  const pageConfig = readJson(`pages/${slug}.json`);
  if (!pageConfig) return { notFound: true };

  const globalTheme = readJson('theme.json');
  return { globalTheme, pageConfig };
}

function readJson(filename) {
  const filePath = path.join(configDir, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
