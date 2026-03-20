import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden grain-overlay">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-800 via-warm-700 to-warm-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A882' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Diagonal accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-cream" style={{ clipPath: 'polygon(0 100%, 100% 60%, 100% 100%)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-10 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          {/* Overline */}
          <div
            className={`transition-all duration-700 delay-300 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">
              vật liệu xây dựng cao cấp
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] text-white transition-all duration-1000 delay-500 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            bê tông
            <br />
            <span className="italic text-sandstone">&amp; đá lát</span>
            <br />
            kiến trúc
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-8 font-body text-base sm:text-lg text-warm-300 max-w-lg leading-relaxed transition-all duration-700 delay-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            gạch lát sân vườn, đá granite, terrazzo, gạch block
            &mdash; sản xuất thủ công tại việt nam với nguyên liệu tự nhiên hảo hạng.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-wrap gap-4 transition-all duration-700 delay-1000 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <a
              href="#collections"
              className="group inline-flex items-center gap-3 bg-sandstone text-charcoal font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-colors duration-300"
            >
              khám phá
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 border border-white/30 text-white font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-white/10 transition-colors duration-300"
            >
              liên hệ
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-[1200ms] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-400">cuộn xuống</span>
          <div className="w-px h-10 bg-gradient-to-b from-sandstone to-transparent" />
        </div>
      </div>
    </section>
  );
}
