'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ProductForm from '@/components/admin/ProductForm';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const dataProvider = getDataProvider();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      await dataProvider.createProduct(productData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">إضافة منتج جديد</h1>
          <p className="text-text-secondary text-sm">أدخل بيانات المنتج وسيتم حفظها محلياً أثناء التطوير.</p>
        </div>
        <Link
          href="/admin/products"
          className="text-text-secondary hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-md"
        >
          ← الرجوع للمنتجات
        </Link>
      </div>

      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/products')}
      />

      {isSaving && (
        <div className="text-sm text-text-secondary">جارٍ الحفظ...</div>
      )}
    </div>
  );
}
