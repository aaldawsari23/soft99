import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background-light/50 border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* About / Branding */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">سوفت 99</span>
              <span className="text-primary text-xs tracking-[0.2em] font-medium">SOFT NINETY NINE</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              وجهتك الأولى للدراجات النارية الاحترافية، قطع الغيار الأصلية، وإكسسوارات الدراجين في المملكة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">روابط سريعة</h4>
            <div className="flex flex-col space-y-2.5">
              <Link href="/" className="text-text-secondary hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                الرئيسية
              </Link>
              <Link href="/catalog" className="text-text-secondary hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                المنتجات
              </Link>
              <Link href="/motorcycles" className="text-text-secondary hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                الدراجات النارية
              </Link>
              <Link href="/parking" className="text-text-secondary hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                مواقف
              </Link>
              <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                تواصل معنا
              </Link>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">تواصل معنا</h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://wa.me/966568663381"
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">إبراهيم عسيري</span>
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">0568663381</span>
                </div>
              </a>
              <a
                href="https://wa.me/966580874790"
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">حسين سهيل</span>
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">0580874790</span>
                </div>
              </a>
            </div>
          </div>

          {/* Working hours & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">معلومات المحل</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-lg mt-0.5">🕒</span>
                <div>
                  <span className="block text-white font-medium mb-1">ساعات العمل</span>
                  <span>يومياً من 5:30 عصراً حتى 3:00 فجراً</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-lg mt-0.5">📍</span>
                <div>
                  <span className="block text-white font-medium mb-1">العنوان</span>
                  <span>جيزان، بجوار مستشفى العميس</span>
                  <Link
                    href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:text-primary-hover mt-1 text-xs font-bold"
                  >
                    <span>فتح في الخرائط</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} سوفت 99. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.snapchat.com/add/h5jk6"
              className="flex items-center gap-2 text-xs text-text-secondary hover:text-yellow-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-lg">👻</span>
              <span>h5jk6</span>
            </a>
            <span className="text-white/10">|</span>
            <p className="text-[10px] text-text-muted">
              Developed by Abdulkarim Aldawsari
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
