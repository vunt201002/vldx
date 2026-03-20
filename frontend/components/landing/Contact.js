import useReveal from '@/hooks/useReveal';

export default function Contact() {
  const sectionRef = useReveal();

  return (
    <section id="contact" className="relative bg-charcoal text-white overflow-hidden grain-overlay" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div className="reveal">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">liên hệ</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
              bắt đầu dự án
              <br />
              <span className="italic text-sandstone">của bạn</span>
            </h2>
            <p className="mt-8 font-body text-warm-400 leading-relaxed max-w-md">
              liên hệ ngay để được tư vấn miễn phí về vật liệu phù hợp cho công trình.
              đội ngũ chuyên gia sẵn sàng hỗ trợ bạn từ thiết kế đến thi công.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <svg className="w-5 h-5 text-sandstone mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <div>
                  <div className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-1">hotline</div>
                  <div className="font-display text-xl text-white">1900 xxxx xx</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg className="w-5 h-5 text-sandstone mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div>
                  <div className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-1">email</div>
                  <div className="font-display text-xl text-white">info@betongviet.vn</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg className="w-5 h-5 text-sandstone mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <div className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-1">showroom</div>
                  <div className="font-display text-xl text-white">TP. Hồ Chí Minh</div>
                  <div className="font-body text-sm text-warm-400 mt-1">Thứ 2 – Thứ 7: 8:00 – 17:30</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="reveal-right">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-2 block">họ tên</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-warm-700 py-3 font-body text-white placeholder-warm-600 focus:border-sandstone focus:outline-none transition-colors"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-2 block">số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full bg-transparent border-b border-warm-700 py-3 font-body text-white placeholder-warm-600 focus:border-sandstone focus:outline-none transition-colors"
                    placeholder="0912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-2 block">email</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-warm-700 py-3 font-body text-white placeholder-warm-600 focus:border-sandstone focus:outline-none transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-2 block">sản phẩm quan tâm</label>
                <select className="w-full bg-transparent border-b border-warm-700 py-3 font-body text-warm-400 focus:border-sandstone focus:outline-none transition-colors appearance-none cursor-pointer">
                  <option value="" className="bg-charcoal">Chọn sản phẩm</option>
                  <option value="gach-lat" className="bg-charcoal">Gạch Lát Sân Vườn</option>
                  <option value="da-granite" className="bg-charcoal">Đá Granite</option>
                  <option value="terrazzo" className="bg-charcoal">Terrazzo</option>
                  <option value="gach-block" className="bg-charcoal">Gạch Block</option>
                  <option value="da-op-lat" className="bg-charcoal">Đá Ốp Lát</option>
                  <option value="bac-thang" className="bg-charcoal">Bậc Thang & Coping</option>
                </select>
              </div>

              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-2 block">nội dung</label>
                <textarea
                  rows="4"
                  className="w-full bg-transparent border-b border-warm-700 py-3 font-body text-white placeholder-warm-600 focus:border-sandstone focus:outline-none transition-colors resize-none"
                  placeholder="Mô tả yêu cầu của bạn..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sandstone text-charcoal font-body text-sm tracking-widest uppercase py-4 hover:bg-white transition-colors duration-300 mt-4"
              >
                gửi yêu cầu tư vấn
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-warm-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl">
            bê tông <span className="italic text-sandstone">việt</span>
          </div>
          <div className="font-body text-xs text-warm-600 tracking-wider">
            &copy; 2026 bê tông việt. thiết kế tại việt nam.
          </div>
          <div className="flex items-center gap-6">
            {['facebook', 'instagram', 'zalo'].map((social) => (
              <a key={social} href="#" className="font-body text-xs tracking-widest uppercase text-warm-500 hover:text-sandstone transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
