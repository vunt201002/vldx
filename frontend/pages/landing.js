import { useState, useEffect } from 'react';
import Head from 'next/head';
import SectionRenderer from '@/components/sections/SectionRenderer';
import initialConfig from '@/config/pages/landing.json';

function buildGoogleFontsUrl(displayFont, bodyFont) {
  const defaults = { display: 'Cormorant', body: 'Outfit' };
  const display = displayFont || defaults.display;
  const body = bodyFont || defaults.body;

  const families = [];
  families.push(`family=${display.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600`);
  if (body !== display) {
    families.push(`family=${body.replace(/ /g, '+')}:wght@300;400;500;600`);
  }

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export default function LandingPage() {
  const [config, setConfig] = useState(initialConfig);

  // Listen for live preview updates from the theme editor
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'theme-preview-update' && e.data.config) {
        setConfig(e.data.config);
      }
    };
    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'theme-preview-ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const displayFont = config.page.displayFont || 'Cormorant';
  const bodyFont = config.page.bodyFont || 'Outfit';
  const fontsUrl = buildGoogleFontsUrl(config.page.displayFont, config.page.bodyFont);

  const fontVars = {
    '--font-display': `"${displayFont}", serif`,
    '--font-body': `"${bodyFont}", sans-serif`,
  };

  return (
    <>
      <Head>
        <title>{config.page.title}</title>
        <meta name="description" content={config.page.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
      </Head>

      <div className={config.page.bodyClass} style={fontVars}>
        <SectionRenderer config={config} />
      </div>
    </>
  );
}
