const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

/**
 * Fetch page data along with global theme (header/footer) in parallel
 * @param {string} slug - Page slug
 * @returns {Promise<{globalTheme, pageData}>}
 */
export async function fetchPageWithTheme(slug) {
  try {
    const [themeRes, pageRes] = await Promise.all([
      fetch(`${apiBase}/theme/active`),
      fetch(`${apiBase}/theme/pages/${slug}`)
    ]);

    if (!pageRes.ok) {
      return { error: 'Page not found', notFound: true };
    }

    const themeData = await themeRes.json();
    const pageData = await pageRes.json();

    return {
      globalTheme: themeData.data,  // { header: { blocks }, footer: { blocks } }
      pageData: pageData.data        // { page, sections, order }
    };
  } catch (error) {
    console.error('Error fetching page with theme:', error);
    return { error: error.message };
  }
}

/**
 * Fetch global theme only (for pages that don't use theme pages)
 * @returns {Promise<{globalTheme}>}
 */
export async function fetchGlobalTheme() {
  try {
    const res = await fetch(`${apiBase}/theme/active`);
    const data = await res.json();

    return { globalTheme: data.data };
  } catch (error) {
    console.error('Error fetching global theme:', error);
    return { error: error.message };
  }
}
