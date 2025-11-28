import { Suspense } from 'react';
import { Metadata } from 'next';
import CatalogContent from '@/components/CatalogContent';
import { STORE } from '@/data/config';

export const metadata: Metadata = {
  title: `المنتجات | ${STORE.name}`,
  description: 'تصفح مجموعتنا من قطع غيار وزيوت الدراجات النارية',
  openGraph: {
    title: `المنتجات | ${STORE.name}`,
    description: 'تصفح مجموعتنا من قطع غيار وزيوت الدراجات النارية',
    type: 'website',
  },
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">المنتجات</h1>
          <p className="text-neutral-400">تصفح مجموعتنا من قطع غيار وزيوت الدراجات النارية</p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-neutral-700 border-t-red-500 rounded-full animate-spin mb-4" />
              <p className="text-neutral-500">جاري التحميل...</p>
            </div>
          </div>
        }>
          <CatalogContent />
        </Suspense>
      </div>
    </div>
  );
}
