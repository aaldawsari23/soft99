'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

import BrandForm from '@/components/admin/BrandForm';
import { getDataProvider } from '@/lib/data-providers';
import { Brand } from '@/types';

export default function NewBrandPage() {
  const router = useRouter();
  const dataProvider = getDataProvider();
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    setIsSaving(true);
    setSubmitError(null);
    try {
      await dataProvider.createBrand(brandData);
      router.push('/admin/brands');
    } catch (error) {
      console.error('Error creating brand', error);
      setSubmitError("حدث خطأ أثناء إضافة العلامة التجارية. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">إضافة علامة تجارية جديدة</h1>
          <p className="text-text-secondary text-sm">أدخل بيانات العلامة التجارية وسيتم حفظها.</p>
        </div>
        <Link
          href="/admin/brands"
          className="text-text-secondary hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-md"
        >
          ← الرجوع للعلامات التجارية
        </Link>
      </div>

      {submitError && (
        <div className="card p-4 bg-red-500/10 border-red-500/20">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <BrandForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/brands')}
      />

      {isSaving && (
        <div className="text-sm text-text-secondary">جاري الحفظ...</div>
      )}
    </div>
  );
}
