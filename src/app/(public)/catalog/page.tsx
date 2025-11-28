import { Suspense } from 'react';
import { Metadata } from 'next';
import CatalogContent from '@/components/CatalogContent';
import { STORE } from '@/data/config';

export const metadata: Metadata = {
  title: `المنتجات | ${STORE.name}`,
  description: 'تصفح مجموعتنا من قطع غيار وزيوت الدراجات النارية',
};

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent />
        </Suspense>
      </div>
    </main>
  );
}

function CatalogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-32 bg-neutral-800 rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden">
            <div className="aspect-square bg-neutral-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
