'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/products/ProductGrid';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';

export default function Home() {
  const [publishedProducts, setPublishedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const dataProvider = getDataProvider();
        const products = await dataProvider.getProducts({ status: 'published' });
        setPublishedProducts(products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Compact */}
      <section className="relative h-[400px] md:h-[480px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
          {/* Placeholder for Hero Image */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              الوجهة الأولى للدراجين
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              انطلق بحرية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">مع سوفت 99</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-neutral-400 max-w-md leading-relaxed">
              اكتشف مجموعتنا المميزة من الدراجات النارية، قطع الغيار الأصلية، والإكسسوارات الاحترافية.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/catalog"
                className="px-6 md:px-8 py-3 md:py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
              >
                تصفح المنتجات
              </Link>
              <Link
                href="/contact"
                className="px-6 md:px-8 py-3 md:py-3.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 font-bold text-sm md:text-base"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact */}
      <section className="py-10 md:py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-500/10 flex items-center justify-center text-xl md:text-2xl mb-3 group-hover:scale-110 transition-transform">🏍️</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">دراجات احترافية</h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">تشكيلة واسعة من الدراجات النارية لأفضل العلامات التجارية العالمية.</p>
            </div>
            <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-500/10 flex items-center justify-center text-xl md:text-2xl mb-3 group-hover:scale-110 transition-transform">🔧</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">قطع غيار أصلية</h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">نوفر جميع قطع الغيار ومستلزمات الصيانة لضمان أداء دراجتك.</p>
            </div>
            <div className="p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-500/10 flex items-center justify-center text-xl md:text-2xl mb-3 group-hover:scale-110 transition-transform">🅿️</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">مواقف آمنة</h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">خدمة مواقف مخصصة للدراجات النارية مع حماية وأمان على مدار الساعة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products Section - Compact */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">أحدث المنتجات</h2>
              <p className="text-neutral-500 text-sm">وصل حديثاً إلى المعرض</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium group text-sm">
              <span>عرض الكل</span>
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={publishedProducts.slice(0, 10)} />

              <div className="mt-8 text-center md:hidden">
                <Link href="/catalog" className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl font-bold transition-all text-sm">
                  عرض كل المنتجات
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">جاهز للانطلاق؟</h2>
          <p className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto mb-6 md:mb-8">
            تفضل بزيارة معرضنا في جيزان للاطلاع على أحدث الموديلات والعروض الحصرية. فريقنا جاهز لخدمتك.
          </p>
          <a
            href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
          >
            <span>📍</span>
            <span>زيارة المعرض</span>
          </a>
        </div>
      </section>
    </div>
  );
}
