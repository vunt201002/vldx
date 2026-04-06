import { useState, useEffect } from 'react';
import ThemeLayout from '@/components/layouts/ThemeLayout';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { fetchPageData } from '@/lib/fetchPageData';

export default function LandingPage({ globalTheme: initialGlobalTheme, pageConfig: initialPageConfig }) {
  const [pageConfig, setPageConfig] = useState(initialPageConfig);
  const [globalTheme, setGlobalTheme] = useState(initialGlobalTheme);

  // Listen for live preview updates from the theme editor
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'theme-preview-update') {
        if (e.data.config) setPageConfig(e.data.config);
        if (e.data.globalTheme) setGlobalTheme(e.data.globalTheme);
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
    <ThemeLayout globalTheme={globalTheme} pageMetadata={pageConfig?.page}>
      <SectionRenderer config={pageConfig} />
    </ThemeLayout>
  );
}

export async function getServerSideProps() {
  try {
    const result = await fetchPageData('landing');
    if (result.notFound) return { notFound: true };
    return {
      props: {
        globalTheme: result.globalTheme,
        pageConfig: result.pageConfig,
      },
    };
  } catch (error) {
    console.error('Error loading landing page:', error);
    return { notFound: true };
  }
}
