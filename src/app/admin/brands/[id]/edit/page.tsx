'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import BrandForm from '@/components/admin/BrandForm';
import { getDataProvider } from '@/lib/data-providers';
import { Brand } from '@/types';

export default function EditBrandPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dataProvider = getDataProvider();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrand() {
      try {
        const found = await dataProvider.getBrandById(id);
        if (!found) {
          setError("لم يتم العثور على العلامة التجارية");
          return;
        }
        setBrand(found);
      } catch (loadError) {
        console.error('Error loading brand', loadError);
        setError("حدث خطأ أثناء تحميل العلامة التجارية");
      } finally {
        setIsLoading(false);
      }
    }
    loadBrand();
  }, [id]);

  const handleSubmit = async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    try {
      setSubmitError(null);
      await dataProvider.updateBrand(id, brandData);
      router.push('/admin/brands');
    } catch (error) {
      console.error('Error updating brand', error);
      setSubmitError("حدث خطأ أثناء تحديث العلامة التجارية");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary">جاري تحميل بيانات العلامة التجارية...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="card p-4 space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <Link
            href="/admin/brands"
            className="text-primary hover:text-primary-hover text-sm"
          >
            ← الرجوع للعلامات التجارية
          </Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return null;
  }

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">تعديل العلامة التجارية</h1>
          <p className="text-text-secondary text-sm">قم بتحديث بيانات العلامة التجارية ثم احفظ التغييرات.</p>
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
        mode="edit"
        initialData={brand}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/brands')}
      />
    </div>
  );
}
