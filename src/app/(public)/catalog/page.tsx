import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogContent from '@/components/CatalogContent';

export const metadata: Metadata = {
  title: 'جميع المنتجات | سوفت 99 - قطع غيار الدراجات النارية',
  description: 'تصفح مجموعتنا الكاملة من قطع غيار وزيوت الدراجات النارية. زيوت موتول، فلاتر، بطاريات وإكسسوارات.',
  openGraph: {
    title: 'جميع المنتجات | سوفت 99',
    description: 'تصفح مجموعتنا الكاملة من قطع غيار الدراجات النارية',
    type: 'website',
  },
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background py-4 md:py-6">
      <div className="container mx-auto px-3 md:px-4">
        {/* Compact Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">جميع المنتجات</h1>
          <p className="text-text-secondary text-sm md:text-base">تصفح مجموعتنا الكاملة من الدراجات والقطع والإكسسوارات</p>
        </div>

        <Suspense fallback={
          <div className="glass rounded-xl p-8 text-center">
            <div className="animate-pulse text-primary text-lg">جاري التحميل...</div>
          </div>
        }>
          <CatalogContent />
        </Suspense>
      </div>
    </div>
  );
}
