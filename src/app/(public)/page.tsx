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
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          {/* Placeholder for Hero Image - In production this should be a real image */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              الوجهة الأولى للدراجين
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              انطلق بحرية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">مع سوفت 99</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
              اكتشف مجموعتنا المميزة من الدراجات النارية، قطع الغيار الأصلية، والإكسسوارات الاحترافية. كل ما تحتاجه لمغامرتك القادمة.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/catalog"
                className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                تصفح المنتجات
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 font-bold"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b border-white/5 bg-background-light/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🏍️</div>
              <h3 className="text-xl font-bold text-white mb-2">دراجات احترافية</h3>
              <p className="text-text-secondary text-sm">تشكيلة واسعة من الدراجات النارية لأفضل العلامات التجارية العالمية.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🔧</div>
              <h3 className="text-xl font-bold text-white mb-2">قطع غيار أصلية</h3>
              <p className="text-text-secondary text-sm">نوفر جميع قطع الغيار ومستلزمات الصيانة لضمان أداء دراجتك.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🅿️</div>
              <h3 className="text-xl font-bold text-white mb-2">مواقف آمنة</h3>
              <p className="text-text-secondary text-sm">خدمة مواقف مخصصة للدراجات النارية مع حماية وأمان على مدار الساعة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">أحدث المنتجات</h2>
              <p className="text-text-secondary">وصل حديثاً إلى المعرض</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium group">
              <span>عرض الكل</span>
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={publishedProducts.slice(0, 10)} />

              <div className="mt-12 text-center md:hidden">
                <Link href="/catalog" className="btn-secondary w-full">
                  عرض كل المنتجات
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">جاهز للانطلاق؟</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
            تفضل بزيارة معرضنا في جيزان للاطلاع على أحدث الموديلات والعروض الحصرية. فريقنا جاهز لخدمتك.
          </p>
          <a
            href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-primary text-lg px-8 py-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
          >
            <span>📍</span>
            <span>زيارة المعرض</span>
          </a>
        </div>
      </section>
    </div>
  );
}
