'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CategoryForm from '@/components/admin/CategoryForm';
import { getDataProvider } from '@/lib/data-providers';
import { Category } from '@/types';

export default function NewCategoryPage() {
  const router = useRouter();
  const dataProvider = getDataProvider();
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    setIsSaving(true);
    setSubmitError(null);
    try {
      await dataProvider.createCategory(categoryData);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category', error);
      setSubmitError("حدث خطأ أثناء إضافة الفئة");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">إضافة فئة جديدة</h1>
          <p className="text-text-secondary text-sm">أدخل بيانات الفئة وسيتم حفظها.</p>
        </div>
        <Link
          href="/admin/categories"
          className="text-text-secondary hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-md"
        >
          ← الرجوع للفئات
        </Link>
      </div>

      {submitError && (
        <div className="card p-4 bg-red-500/10 border-red-500/20">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <CategoryForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/categories')}
      />

      {isSaving && (
        <div className="text-sm text-text-secondary">جاري الحفظ...</div>
      )}
    </div>
  );
}
