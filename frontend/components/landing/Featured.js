import useReveal from '@/hooks/useReveal';

const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-sandstone">
        <circle cx="20" cy="20" r="18" />
        <path d="M20 8v24M8 20h24" />
      </svg>
    ),
    title: 'Sản Xuất Thủ Công',
    desc: 'Mỗi sản phẩm được tạo ra bằng tay bởi đội ngũ nghệ nhân giàu kinh nghiệm, đảm bảo chất lượng từng chi tiết.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-sandstone">
        <path d="M6 34L20 6l14 28H6z" />
        <circle cx="20" cy="24" r="4" />
      </svg>
    ),
    title: 'Nguyên Liệu Tự Nhiên',
    desc: 'Đá, cát, xi măng cao cấp — 100% nguyên liệu tự nhiên, không pha tạp, thân thiện với môi trường.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-sandstone">
        <rect x="4" y="4" width="32" height="32" rx="2" />
        <path d="M4 20h32M20 4v32" />
      </svg>
    ),
    title: 'Đa Dạng Kích Thước',
    desc: 'Sản xuất theo kích thước tiêu chuẩn hoặc cắt theo yêu cầu riêng của từng công trình.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-sandstone">
        <path d="M20 4C11 4 4 11 4 20s7 16 16 16" />
        <path d="M20 4c9 0 16 7 16 16s-7 16-16 16" strokeDasharray="4 4" />
        <circle cx="20" cy="20" r="6" />
      </svg>
    ),
    title: 'Bảo Hành Dài Hạn',
    desc: 'Cam kết bảo hành sản phẩm lên đến 10 năm, đồng hành cùng mọi công trình của bạn.',
  },
];

export default function Featured() {
  const sectionRef = useReveal();

  return (
    <section className="bg-cream py-24 lg:py-36 relative" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="reveal text-center mb-16 lg:mb-24">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">tại sao chọn chúng tôi</span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.1]">
            chất lượng <span className="italic text-concrete">không thỏa hiệp</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-sand">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-cream p-8 lg:p-10 group hover:bg-warm-50 transition-colors duration-500"
            >
              <div className="mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl text-charcoal mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-warm-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
