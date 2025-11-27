'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDataProvider } from '@/lib/data-providers';
import { Brand } from '@/types';
import { toast } from 'react-hot-toast';

export default function BrandsPage() {
  const dataProvider = getDataProvider();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل العلامات التجارية
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await dataProvider.getBrands();
        setBrands(data);
      } catch (err) {
        console.error('Error loading brands', err);
        toast.error('حدث خطأ أثناء تحميل العلامات التجارية');
        setError('حدث خطأ أثناء تحميل العلامات التجارية');
      } finally {
        setIsLoading(false);
      }
    }
    loadBrands();
  }, [dataProvider]);

  // حذف علامة تجارية
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه العلامة التجارية؟')) return;

    try {
      await dataProvider.deleteBrand(id);
      setBrands(brands.filter(brand => brand.id !== id));
      toast.success('تم حذف العلامة التجارية بنجاح');
    } catch (err) {
      console.error('Error deleting brand', err);
      toast.error('حدث خطأ أثناء حذف العلامة التجارية');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">جاري تحميل العلامات التجارية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center border-red-500/20 bg-red-500/5">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 btn-secondary text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">العلامات التجارية</h1>
          <p className="text-text-secondary mt-1">
            إدارة العلامات التجارية والشركات المصنعة
          </p>
        </div>
        <Link href="/admin/brands/new" className="btn-primary">
          + إضافة علامة
        </Link>
      </div>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🏷️</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد علامات تجارية حالياً</h3>
          <p className="text-text-muted mb-6">أضف العلامات التجارية لربط المنتجات بها</p>
          <Link href="/admin/brands/new" className="btn-primary inline-block">
            إضافة أول علامة تجارية
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {brands.map((brand) => (
            <div key={brand.id} className="card p-5 group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 text-center">
              {/* Logo */}
              <div className="w-24 h-24 bg-white rounded-xl mx-auto mb-5 flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors shadow-lg shadow-black/20">
                {brand.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23fff" width="80" height="80"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="40">🏷️</text></svg>';
                    }}
                  />
                ) : (
                  <span className="text-4xl">🏷️</span>
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {brand.name_ar || brand.name}
              </h3>
              {(brand.name_ar && brand.name !== brand.name_ar) && (
                <p className="text-xs text-text-muted font-medium mb-3">{brand.name}</p>
              )}

              {/* Description */}
              <p className="text-sm text-text-secondary mb-5 line-clamp-2 min-h-[40px]">
                {brand.description || 'لا يوجد وصف'}
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link
                  href={`/admin/brands/${brand.id}/edit`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-background-light text-text-secondary hover:bg-primary hover:text-white transition-all text-sm font-medium"
                >
                  ✏️ تعديل
                </Link>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-background-light text-text-secondary hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {brands.length > 0 && (
        <div className="text-left text-xs text-text-muted">
          إجمالي العلامات التجارية: <span className="text-white font-bold">{brands.length}</span>
        </div>
      )}
    </div>
  );
}
