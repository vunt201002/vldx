import useReveal from '@/hooks/useReveal';
import { icons } from './icons';

export default function Contact({ id, settings, blocks }) {
  const sectionRef = useReveal();

  const contactInfos = blocks.filter((b) => b.type === 'contact-info');
  const socialLinks = blocks.filter((b) => b.type === 'social-link');

  return (
    <section id={id} className="relative bg-charcoal text-white overflow-hidden grain-overlay" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div className="reveal">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-sandstone">{settings.overline}</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
              {settings.title}
              <br />
              <span className="italic text-sandstone">{settings.titleAccent}</span>
            </h2>
            <p className="mt-8 font-body text-warm-400 leading-relaxed max-w-md">
              {settings.description}
            </p>

            <div className="mt-12 space-y-6">
              {contactInfos.map((block) => {
                const info = block.settings;
                const Icon = icons[info.iconName];
                return (
                  <div key={info.label} className="flex items-start gap-4">
                    {Icon && <Icon className="w-5 h-5 text-sandstone mt-0.5 shrink-0" />}
                    <div>
                      <div className="font-body text-xs tracking-[0.2em] uppercase text-warm-500 mb-1">{info.label}</div>
                      <div className="font-display text-xl text-white">{info.value}</div>
                      {info.detail && (
                        <div className="font-body text-sm text-warm-400 mt-1">{info.detail}</div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                {settings.formSubmitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-warm-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl">
            {settings.footerBrand.replace(settings.footerBrandAccent, '').trim()} <span className="italic text-sandstone">{settings.footerBrandAccent}</span>
          </div>
          <div className="font-body text-xs text-warm-600 tracking-wider">
            {settings.footerCopyright}
          </div>
          <div className="flex items-center gap-6">
            {socialLinks.map((block) => (
              <a key={block.settings.label} href={block.settings.href} className="font-body text-xs tracking-widest uppercase text-warm-500 hover:text-sandstone transition-colors">
                {block.settings.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
