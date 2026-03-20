import Head from 'next/head';
import SectionRenderer from '@/components/sections/SectionRenderer';
import config from '@/config/pages/landing.json';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>{config.page.title}</title>
        <meta name="description" content={config.page.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={config.page.bodyClass}>
        <SectionRenderer config={config} />
      </div>
    </>
  );
}
