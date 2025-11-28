'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import { getDataProvider } from '@/lib/data-providers';
import { filterProducts } from '@/utils/catalog';
import { toast } from 'react-hot-toast';
import { Tabs } from '@/components/ui/Tabs';

export default function AdminProductsPage() {
  const dataProvider = getDataProvider();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from provider
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await dataProvider.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('فشل تحميل المنتجات');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const success = await dataProvider.deleteProduct(productId);
        if (success) {
          setProducts(prev => prev.filter(p => p.id !== productId));
          toast.success('تم حذف المنتج بنجاح');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newStatus = product.status === 'published' ? 'hidden' : 'published';
      const updated = await dataProvider.updateProduct(productId, { status: newStatus });

      setProducts(prev => prev.map(p =>
        p.id === productId ? updated : p
      ));
      toast.success('تم تحديث حالة المنتج');
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة المنتج');
    }
  };

  const filteredProducts = filterProducts(products, {
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const filterTabs = [
    { id: 'all', label: 'الكل', icon: '📦' },
    { id: 'published', label: 'منشور', icon: '✅' },
    { id: 'hidden', label: 'مسودة', icon: '👁️‍🗨️' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="section-title">إدارة المنتجات</h1>
          <p className="text-text-secondary mt-1">عرض وإدارة جميع المنتجات في المتجر</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary w-full sm:w-auto text-center">
          + إضافة منتج جديد
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="card p-0 overflow-hidden">
        <div className="border-b border-border bg-background-light/30 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <Tabs
            tabs={filterTabs}
            activeTab={statusFilter}
            onChange={(id) => setStatusFilter(id as 'all' | 'published' | 'hidden')}
            className="border-none w-full md:w-auto justify-center md:justify-start"
          />

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light/50">
              <tr>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">المنتج</th>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">التصنيف</th>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">السعر</th>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">المخزون</th>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">الحالة</th>
                <th className="text-right py-4 px-6 text-text-secondary font-medium text-sm">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-background-card rounded-lg overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name_ar} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🏍️</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{product.name_ar}</div>
                        {product.name_en && (
                          <div className="text-xs text-text-muted">{product.name_en}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-text-secondary">
                      {product.type === 'bike' ? 'دراجة' : product.type === 'part' ? 'قطعة' : 'إكسسوار'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">
                      {product.price} <span className="text-xs text-text-muted font-normal">{product.currency}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {product.stock_quantity && product.stock_quantity > 0 ? (
                        <span className="text-green-400">{product.stock_quantity} قطعة</span>
                      ) : (
                        <span className="text-red-400">نفذت الكمية</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {product.status === 'published' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        منشور
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        مسودة
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
                        title="تعديل"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                        title={product.status === 'published' ? 'إخفاء' : 'نشر'}
                      >
                        {product.status === 'published' ? '👁️' : '👁️‍🗨️'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-border">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-background-card rounded-lg overflow-hidden border border-border flex-shrink-0">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name_ar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white truncate">{product.name_ar}</h3>
                    {product.status === 'published' ? (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate mt-1">{product.name_en}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-bold text-primary">{product.price} {product.currency}</span>
                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                      {product.type === 'bike' ? 'دراجة' : product.type === 'part' ? 'قطعة' : 'إكسسوار'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 btn-secondary py-2 text-xs justify-center"
                >
                  تعديل
                </Link>
                <button
                  onClick={() => handleToggleStatus(product.id)}
                  className="flex-1 btn-secondary py-2 text-xs justify-center"
                >
                  {product.status === 'published' ? 'إخفاء' : 'نشر'}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 btn-secondary py-2 text-xs justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات</h3>
            <p className="text-text-secondary mb-6">لم يتم العثور على منتجات تطابق بحثك</p>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="btn-secondary"
              >
                عرض كل المنتجات
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-left text-xs text-text-muted">
        إجمالي المنتجات: {filteredProducts.length}
      </div>
    </div>
  );
}
