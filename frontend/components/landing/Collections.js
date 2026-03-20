import useReveal from '@/hooks/useReveal';

const products = [
  {
    name: 'Gạch Lát Sân Vườn',
    slug: 'gach-lat',
    desc: 'Bề mặt chống trơn, chịu lực cao, phù hợp lối đi và sân vườn ngoài trời.',
    specs: '400×400mm  ·  50mm dày',
    color: 'from-amber-800/80 to-amber-900/90',
  },
  {
    name: 'Đá Granite',
    slug: 'da-granite',
    desc: 'Đá tự nhiên gia công chính xác, bề mặt mài nhám hoặc đánh bóng theo yêu cầu.',
    specs: '600×300mm  ·  20mm dày',
    color: 'from-stone-600/80 to-stone-800/90',
  },
  {
    name: 'Terrazzo',
    slug: 'terrazzo',
    desc: 'Phối trộn đá marble, granite và xi măng — mỗi viên gạch là một tác phẩm nghệ thuật.',
    specs: '400×400mm  ·  30mm dày',
    color: 'from-rose-800/70 to-stone-800/90',
  },
  {
    name: 'Gạch Block',
    slug: 'gach-block',
    desc: 'Gạch thông gió trang trí, tạo điểm nhấn kiến trúc cho tường rào và mặt tiền.',
    specs: '190×190mm  ·  90mm dày',
    color: 'from-slate-600/80 to-slate-800/90',
  },
  {
    name: 'Đá Ốp Lát',
    slug: 'da-op-lat',
    desc: 'Đá ốp tường và lát nền, vân tự nhiên, phù hợp không gian nội thất cao cấp.',
    specs: '600×600mm  ·  15mm dày',
    color: 'from-warm-500/80 to-warm-800/90',
  },
  {
    name: 'Bậc Thang & Coping',
    slug: 'bac-thang',
    desc: 'Bậc cầu thang và viền hồ bơi, bo cạnh tròn an toàn, chống trơn trượt.',
    specs: '1000×350mm  ·  40mm dày',
    color: 'from-cyan-800/70 to-slate-800/90',
  },
];

export default function Collections() {
  const sectionRef = useReveal();

  return (
    <section id="collections" className="bg-cream py-24 lg:py-36 relative" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal mb-16 lg:mb-24">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">bộ sưu tập</span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
            sản phẩm <span className="italic text-concrete">nổi bật</span>
          </h2>
          <p className="mt-6 font-body text-warm-500 max-w-xl leading-relaxed">
            mỗi dòng sản phẩm được sản xuất thủ công, kiểm soát chất lượng nghiêm ngặt từ nguyên liệu đến thành phẩm.
          </p>
        </div>

        {/* Products Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <a
              key={product.slug}
              href={`/materials?category=${product.slug}`}
              className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
            >
              {/* Background gradient placeholder (replace with product images) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.color} transition-transform duration-700 group-hover:scale-105`} />

              {/* Grain texture */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }} />

              {/* Content overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-8">
                <div>
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/60">
                    {product.specs}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl lg:text-3xl text-white leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-3 font-body text-sm text-white/70 leading-relaxed max-w-[280px]">
                    {product.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-2 font-body text-xs tracking-widest uppercase text-sandstone">
                    <span>xem chi tiết</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
