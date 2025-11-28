'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProductForm from '@/components/admin/ProductForm';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const dataProvider = getDataProvider();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const found = await dataProvider.getProductById(id);
        if (!found) {
          setError('لم يتم العثور على المنتج');
          return;
        }
        setProduct(found);
      } catch (loadError) {
        console.error('Error loading product', loadError);
        setError('حدث خطأ أثناء تحميل المنتج');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [dataProvider, id]);

  const handleSubmit = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    await dataProvider.updateProduct(id, productData);
    router.push('/admin/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary">جارٍ تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="card p-4 space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <Link
            href="/admin/products"
            className="text-primary hover:text-primary-hover text-sm"
          >
            ← الرجوع للمنتجات
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="px-2 sm:px-4 pb-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">تعديل المنتج</h1>
          <p className="text-text-secondary text-sm">قم بتحديث بيانات المنتج ثم احفظ التغييرات.</p>
        </div>
        <Link
          href="/admin/products"
          className="text-text-secondary hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-md"
        >
          ← الرجوع للمنتجات
        </Link>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/products')}
      />
    </div>
  );
}
