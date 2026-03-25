import { useState, useEffect } from 'react';
import Head from 'next/head';
import SectionRenderer from '@/components/sections/SectionRenderer';

function buildGoogleFontsUrl(displayFont, bodyFont) {
  const defaults = { display: 'Cormorant', body: 'Cormorant' };
  const display = displayFont || defaults.display;
  const body = bodyFont || defaults.body;

  const families = [];
  families.push(`family=${display.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600`);
  if (body !== display) {
    families.push(`family=${body.replace(/ /g, '+')}:wght@300;400;500;600`);
  }

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export default function DynamicPage({ config: initialConfig }) {
  const [config, setConfig] = useState(initialConfig);

  // Listen for live preview updates from the theme editor
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'theme-preview-update' && e.data.config) {
        setConfig(e.data.config);
      }
    };
    window.addEventListener('message', handleMessage);

    // Tell the parent we're ready to receive preview data
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'theme-preview-ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!config) return null;

  const displayFont = config.page.displayFont || 'Cormorant';
  const bodyFont = config.page.bodyFont || 'Cormorant';
  const fontsUrl = buildGoogleFontsUrl(config.page.displayFont, config.page.bodyFont);

  const fontVarsStyle = `:root { --font-display: "${displayFont}", serif; --font-body: "${bodyFont}", sans-serif; }`;

  return (
    <>
      <Head>
        <title>{config.page.title}</title>
        <meta name="description" content={config.page.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
        <style>{fontVarsStyle}</style>
      </Head>

      <div className={config.page.bodyClass}>
        <SectionRenderer config={config} />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

  try {
    const res = await fetch(`${apiBase}/pages/${slug}`);
    if (!res.ok) return { notFound: true };
    const json = await res.json();
    return { props: { config: json.data } };
  } catch {
    return { notFound: true };
  }
}
