import { useState, useEffect } from 'react';
import ThemeLayout from '@/components/layouts/ThemeLayout';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { transformPageData } from '@/lib/transformPageConfig';

export default function LandingPage({ globalTheme, pageConfig: initialPageConfig }) {
  const [pageConfig, setPageConfig] = useState(initialPageConfig);

  // Listen for live preview updates from the theme editor
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'theme-preview-update' && e.data.config) {
        setPageConfig(e.data.config);
      }
    };
    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'theme-preview-ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!pageConfig) return null;

  return (
    <ThemeLayout globalTheme={globalTheme} pageMetadata={pageConfig.page}>
      <SectionRenderer config={pageConfig} />
    </ThemeLayout>
  );
}

export async function getServerSideProps() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

  try {
    const [themeRes, pageRes] = await Promise.all([
      fetch(`${apiBase}/theme/active`),
      fetch(`${apiBase}/theme/pages/landing`)
    ]);

    if (!pageRes.ok) return { notFound: true };

    const themeData = await themeRes.json();
    const pageData = await pageRes.json();

    // Transform backend format to frontend config format
    const pageConfig = transformPageData(pageData.data);

    return {
      props: {
        globalTheme: themeData.data,
        pageConfig
      }
    };
  } catch (error) {
    console.error('Error loading landing page:', error);
    return { notFound: true };
  }
}
