'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDataProvider } from '@/lib/data-providers';
import { Category } from '@/types';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const dataProvider = getDataProvider();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل الفئات
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await dataProvider.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories', err);
        toast.error('حدث خطأ أثناء تحميل الفئات');
        setError('حدث خطأ أثناء تحميل الفئات');
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, [dataProvider]);

  // حذف فئة
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      await dataProvider.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('تم حذف الفئة بنجاح');
    } catch (err) {
      console.error('Error deleting category', err);
      toast.error('حدث خطأ أثناء حذف الفئة');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">جاري تحميل الفئات...</p>
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
          <h1 className="section-title">الفئات</h1>
          <p className="text-text-secondary mt-1">
            إدارة فئات المنتجات وتنظيمها
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          + إضافة فئة
        </Link>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد فئات حالياً</h3>
          <p className="text-text-muted mb-6">قم بإضافة فئات لتنظيم منتجاتك بشكل أفضل</p>
          <Link href="/admin/categories/new" className="btn-primary inline-block">
            إضافة أول فئة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div key={category.id} className="card p-5 group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background-light flex items-center justify-center text-2xl border border-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {category.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {category.name_ar}
                    </h3>
                    {category.name_en && (
                      <p className="text-xs text-text-muted font-medium">{category.name_en}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${category.type === 'bike' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    category.type === 'part' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                  {category.type === 'part' && '🔧 قطع غيار'}
                  {category.type === 'bike' && '🏍️ دراجات نارية'}
                  {category.type === 'gear' && '🦺 معدات'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-5 line-clamp-2 min-h-[40px]">
                {category.description || 'لا يوجد وصف لهذه الفئة'}
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-background-light text-text-secondary hover:bg-primary hover:text-white transition-all text-sm font-medium"
                >
                  ✏️ تعديل
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
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
      {categories.length > 0 && (
        <div className="text-left text-xs text-text-muted">
          إجمالي الفئات: <span className="text-white font-bold">{categories.length}</span>
        </div>
      )}
    </div>
  );
}
