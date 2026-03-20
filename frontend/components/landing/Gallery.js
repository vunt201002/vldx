import useReveal from '@/hooks/useReveal';

const galleryItems = [
  { aspect: 'row-span-2', gradient: 'from-amber-700 to-stone-700', label: 'sân vườn biệt thự', tag: 'gạch lát' },
  { aspect: '', gradient: 'from-stone-500 to-stone-700', label: 'bếp terrazzo', tag: 'terrazzo' },
  { aspect: '', gradient: 'from-rose-700 to-stone-800', label: 'hồ bơi resort', tag: 'coping' },
  { aspect: '', gradient: 'from-slate-500 to-slate-700', label: 'tường rào breeze block', tag: 'gạch block' },
  { aspect: 'row-span-2', gradient: 'from-warm-500 to-warm-700', label: 'nội thất cao cấp', tag: 'đá ốp' },
  { aspect: '', gradient: 'from-cyan-700 to-slate-700', label: 'lối đi công viên', tag: 'đá granite' },
];

export default function Gallery() {
  const sectionRef = useReveal();

  return (
    <section id="gallery" className="bg-sand py-24 lg:py-36" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="reveal flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">dự án</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
              cảm hứng <span className="italic text-concrete">thiết kế</span>
            </h2>
          </div>
          <a
            href="/materials"
            className="mt-6 lg:mt-0 inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-warm-600 hover:text-sandstone transition-colors"
          >
            xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Masonry Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-4">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden cursor-pointer ${item.aspect}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-700 group-hover:scale-110`} />

              {/* Noise texture */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }} />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-500" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/50 bg-white/10 backdrop-blur-sm w-fit px-3 py-1">
                  {item.tag}
                </span>
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-display text-xl lg:text-2xl text-white">
                    {item.label}
                  </h3>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-body text-xs tracking-widest uppercase text-sandstone">
                    xem dự án
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
