import Head from 'next/head';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { blocksToConfig } from '@/lib/transformPageConfig';

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

export default function ThemeLayout({
  globalTheme,
  pageMetadata = {},
  children,
  loading = false,
  error = null
}) {
  const displayFont = pageMetadata.displayFont || 'Cormorant';
  const bodyFont = pageMetadata.bodyFont || 'Cormorant';
  const fontsUrl = buildGoogleFontsUrl(displayFont, bodyFont);

  const fontVarsStyle = `:root { --font-display: "${displayFont}", serif; --font-body: "${bodyFont}", sans-serif; }`;

  const title = pageMetadata.title || 'VLXD - Vật Liệu Xây Dựng';
  const description = pageMetadata.description || 'Vật liệu xây dựng cao cấp';
  const bodyClass = pageMetadata.bodyClass || 'font-body bg-cream text-charcoal';

  // Transform global header and footer blocks to config format
  const headerConfig = blocksToConfig(globalTheme?.header?.blocks || []);
  const footerConfig = blocksToConfig(globalTheme?.footer?.blocks || []);

  if (loading) {
    return (
      <div className={bodyClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={bodyClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
        <style>{fontVarsStyle}</style>
      </Head>

      <div className={bodyClass}>
        {/* Global Header */}
        {headerConfig.order.length > 0 && (
          <SectionRenderer config={headerConfig} />
        )}

        {/* Page Content */}
        <main>
          {children}
        </main>

        {/* Global Footer */}
        {footerConfig.order.length > 0 && (
          <SectionRenderer config={footerConfig} />
        )}
      </div>
    </>
  );
}
