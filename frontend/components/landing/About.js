import useReveal from '@/hooks/useReveal';

const stats = [
  { value: '15+', label: 'năm kinh nghiệm' },
  { value: '500+', label: 'dự án hoàn thành' },
  { value: '50+', label: 'mẫu sản phẩm' },
  { value: '100%', label: 'nguyên liệu tự nhiên' },
];

export default function About() {
  const sectionRef = useReveal();

  return (
    <section id="about" className="relative bg-charcoal text-white overflow-hidden diagonal-top grain-overlay" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-32 lg:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Story */}
          <div className="reveal-left">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">câu chuyện</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
              nguyên liệu
              <br />
              <span className="italic text-sandstone">tạo nên khác biệt</span>
            </h2>
            <div className="mt-8 space-y-5 font-body text-warm-300 leading-relaxed">
              <p>
                chúng tôi tin rằng mỗi viên gạch, mỗi tấm đá đều kể một câu chuyện riêng. từ
                những mỏ đá tự nhiên đến xưởng sản xuất thủ công, mỗi sản phẩm đều mang trong mình
                dấu ấn của đất, nước và bàn tay nghệ nhân việt nam.
              </p>
              <p>
                với quy trình sản xuất thân thiện môi trường và tiêu chuẩn chất lượng quốc tế,
                sản phẩm của chúng tôi không chỉ đẹp mà còn bền vững theo thời gian — từ sân vườn
                đến nội thất, từ hồ bơi đến mặt tiền công trình.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 mt-10 font-body text-sm tracking-widest uppercase text-sandstone border-b border-sandstone/40 pb-1 hover:border-sandstone transition-colors duration-300"
            >
              tìm hiểu thêm
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right: Stats + Visual */}
          <div className="reveal-right">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border border-warm-700/50 p-6 lg:p-8">
                  <div className="font-display text-4xl lg:text-5xl text-sandstone italic">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-body text-xs tracking-[0.2em] uppercase text-warm-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual element */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-warm-600 to-warm-800" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }} />
              <div className="relative z-10 h-full flex items-end p-8">
                <div>
                  <div className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">showroom</div>
                  <div className="font-display text-2xl lg:text-3xl text-white italic">xưởng sản xuất tại miền nam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
