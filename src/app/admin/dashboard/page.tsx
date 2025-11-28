'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getDashboardStats } from '@/lib/db-admin';
import { Product } from '@/types';

const DataMigration = dynamic(() => import('@/components/admin/DataMigration'), {
  loading: () => <div className="p-4 text-center">جاري تحميل أداة النقل...</div>
});

const DashboardChart = dynamic(() => import('@/components/admin/DashboardChart'), {
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-white/5 rounded-xl">جاري تحميل الرسم البياني...</div>,
  ssr: false
});

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  hiddenProducts: number;
  totalCategories: number;
  totalBrands: number;
  recentProducts: Product[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const productStatusData = [
    { name: 'منشور', value: stats.publishedProducts, color: '#22c55e' },
    { name: 'مخفي', value: stats.hiddenProducts, color: '#eab308' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-title">لوحة التحكم</h1>
        <p className="text-text-secondary mt-1">نظرة عامة على أداء المتجر والإحصائيات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</div>
          <div className="text-sm text-text-secondary">إجمالي المنتجات</div>
        </div>

        <div className="card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.publishedProducts}</div>
          <div className="text-sm text-text-secondary">منتجات منشورة</div>
        </div>

        <div className="card p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalBrands}</div>
          <div className="text-sm text-text-secondary">العلامات التجارية</div>
        </div>

        <div className="card p-5 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalCategories}</div>
          <div className="text-sm text-text-secondary">الفئات</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-bold text-white mb-6">حالة المنتجات</h2>
          <DashboardChart data={productStatusData} />
        </div>

        {/* Quick Actions & Recent */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h2>
            <div className="space-y-3">
              <Link href="/admin/products/new" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <span>➕</span>
                <span>إضافة منتج جديد</span>
              </Link>
              <Link href="/admin/categories" className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
                <span>📁</span>
                <span>إدارة الفئات</span>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">أحدث الإضافات</h2>
              <Link href="/admin/products" className="text-primary text-sm hover:text-primary-hover">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentProducts.map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-background-light rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 bg-background-card rounded-md flex items-center justify-center overflow-hidden border border-border">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name_ar} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">🏍️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{product.name_ar}</div>
                    <div className="text-xs text-text-secondary">{product.price} {product.currency}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${product.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Migration Tool (Collapsible or at bottom) */}
      <div className="border-t border-border pt-8">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-white transition-colors">
            <span className="text-sm">أدوات متقدمة (نقل البيانات)</span>
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <div className="mt-4">
            <DataMigration />
          </div>
        </details>
      </div>
    </div>
  );
}
