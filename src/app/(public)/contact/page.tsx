'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">تواصل معنا</h1>
            <p className="text-text-secondary text-lg">نحن هنا لمساعدتك في كل ما تحتاجه</p>
          </div>
          <div className="card space-y-8">
            {/* Phone Numbers */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-1">أرقام التواصل</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-sm mb-1">إبراهيم عسيري</span>
                    <div className="flex gap-3">
                      <a
                        href="tel:+966568663381"
                        className="text-primary hover:text-primary-hover flex items-center gap-1"
                      >
                        📞 اتصال
                      </a>
                      <a
                        href="https://wa.me/966568663381"
                        className="text-primary hover:text-primary-hover flex items-center gap-1"
                      >
                        💬 واتساب
                      </a>
                      <span className="text-white">0568663381</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-sm mb-1">حسين سهيل</span>
                    <div className="flex gap-3">
                      <a
                        href="tel:+966580874790"
                        className="text-primary hover:text-primary-hover flex items-center gap-1"
                      >
                        📞 اتصال
                      </a>
                      <a
                        href="https://wa.me/966580874790"
                        className="text-primary hover:text-primary-hover flex items-center gap-1"
                      >
                        💬 واتساب
                      </a>
                      <span className="text-white">0580874790</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">🕒</div>
              <div>
                <h3 className="text-white font-semibold mb-1">أوقات العمل</h3>
                <p className="text-text-secondary">يومياً من 5:30 عصراً حتى 3:00 فجراً</p>
              </div>
            </div>
            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">📍</div>
              <div className="w-full">
                <h3 className="text-white font-semibold mb-2">الموقع</h3>
                <p className="text-text-secondary mb-3">جيزان، بجوار مستشفى العميس، المملكة العربية السعودية</p>
                <div className="flex gap-3 mb-4">
                  <a
                    href="https://www.google.com/maps?q=16.9064,42.5525"
                    className="text-primary hover:text-primary-hover text-sm inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    فتح في خرائط جوجل ←
                  </a>
                  <a
                    href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
                    className="text-primary hover:text-primary-hover text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    الرابط المختصر
                  </a>
                </div>
                {/* Google Maps Embed */}
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                  <iframe
                    src="https://www.google.com/maps?q=16.9064,42.5525&hl=ar&z=15&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع المحل على الخريطة"
                  ></iframe>
                </div>
              </div>
            </div>
            {/* SnapChat */}
            <div className="flex items-start gap-4">
              <div className="text-3xl">👻</div>
              <div>
                <h3 className="text-white font-semibold mb-1">تابعنا على سناب شات</h3>
                <a
                  href="https://www.snapchat.com/add/h5jk6"
                  className="text-primary hover:text-primary-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  h5jk6
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
