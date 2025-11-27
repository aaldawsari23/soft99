'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CategoryForm from '@/components/admin/CategoryForm';
import { getDataProvider } from '@/lib/data-providers';
import { Category } from '@/types';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dataProvider = getDataProvider();

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategory() {
      try {
        const found = await dataProvider.getCategoryById(id);
        if (!found) {
          setError("لم يتم العثور على الفئة");
          return;
        }
        setCategory(found);
      } catch (loadError) {
        console.error('Error loading category', loadError);
        setError("حدث خطأ أثناء تحميل الفئة");
      } finally {
        setIsLoading(false);
      }
    }
    loadCategory();
  }, [id]);

  const handleSubmit = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      setSubmitError(null);
      await dataProvider.updateCategory(id, categoryData);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category', error);
      setSubmitError("حدث خطأ أثناء تحديث الفئة");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="card p-4 space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <Link
            href="/admin/categories"
            className="text-primary hover:text-primary-hover text-sm"
          >
            ← الرجوع للفئات
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">تعديل الفئة</h1>
          <p className="text-text-secondary text-sm">قم بتحديث بيانات الفئة ثم احفظ التغييرات.</p>
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
        mode="edit"
        initialData={category}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/categories')}
      />
    </div>
  );
}
