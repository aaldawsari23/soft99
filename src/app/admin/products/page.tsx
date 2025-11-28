'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const provider = getDataProvider();
        const [productsData, categoriesData] = await Promise.all([
          provider.getProducts(),
          provider.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (product.name_ar || product.name || '').toLowerCase();
        if (!name.includes(query)) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && product.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Delete product
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const provider = getDataProvider();
      await provider.deleteProduct(deleteId);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      showToast('تم حذف المنتج بنجاح', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('حدث خطأ في حذف المنتج', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Get category name
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find(c => c.id === categoryId)?.name_ar || '-';
  };

  if (isLoading) {
    return <ProductsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">المنتجات</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {filteredProducts.length} منتج
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة منتج
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث..."
            className="w-full pl-4 pr-10 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 outline-none focus:border-red-500/50"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
        >
          <option value="all">كل الفئات</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
        >
          <option value="all">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800/50">
                <tr>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">المنتج</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400 hidden md:table-cell">الفئة</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">السعر</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">الحالة</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-neutral-400 w-24">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">📦</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate max-w-[200px]">
                            {product.name_ar || product.name}
                          </div>
                          <div className="text-neutral-500 text-xs md:hidden">
                            {getCategoryName(product.category_id)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-sm hidden md:table-cell">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {product.price > 0 ? `${product.price} ر.س` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${product.status === 'published'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {product.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-white mb-2">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'لا توجد نتائج'
                : 'لا توجد منتجات'
              }
            </h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'جرب تغيير معايير البحث'
                : 'ابدأ بإضافة أول منتج'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                إضافة منتج
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={isDeleting ? 'جاري الحذف...' : 'حذف'}
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-32 bg-neutral-800 rounded" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-neutral-800 rounded-xl" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
      </div>
      <div className="bg-neutral-900 rounded-2xl h-96" />
    </div>
  );
}
