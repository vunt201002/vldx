import Head from 'next/head';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Collections from '@/components/landing/Collections';
import About from '@/components/landing/About';
import Featured from '@/components/landing/Featured';
import Gallery from '@/components/landing/Gallery';
import Contact from '@/components/landing/Contact';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Bê Tông Việt — Vật Liệu Xây Dựng Cao Cấp</title>
        <meta name="description" content="Gạch lát sân vườn, đá granite, terrazzo, gạch block — sản xuất thủ công tại Việt Nam với nguyên liệu tự nhiên hảo hạng." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="font-body bg-cream text-charcoal">
        <Navbar />
        <Hero />
        <Collections />
        <About />
        <Featured />
        <Gallery />
        <Contact />
      </div>
    </>
  );
}
