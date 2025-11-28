'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';

interface DashboardStats {
    totalProducts: number;
    publishedProducts: number;
    draftProducts: number;
    totalCategories: number;
    totalBrands: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);
                setError(null);
                const provider = getDataProvider();
                const [products, categories, brands] = await Promise.all([
                    provider.getProducts(),
                    provider.getCategories(),
                    provider.getBrands(),
                ]);

                setStats({
                    totalProducts: products.length,
                    publishedProducts: products.filter(p => p.status === 'published').length,
                    draftProducts: products.filter(p => p.status === 'draft').length,
                    totalCategories: categories.length,
                    totalBrands: brands.length,
                });

                // آخر 5 منتجات
                const sorted = [...products].sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                });
                setRecentProducts(sorted.slice(0, 5));
            } catch (err) {
                console.error('Error loading dashboard:', err);
                setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
            } finally {
                setIsLoading(false);
            }
        }
        loadDashboard();
    }, []);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-white">مرحباً 👋</h1>
                <p className="text-neutral-500 mt-1">إليك نظرة سريعة على متجرك</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="إجمالي المنتجات"
                    value={stats?.totalProducts || 0}
                    icon="📦"
                    href="/admin/products"
                />
                <StatCard
                    label="منشور"
                    value={stats?.publishedProducts || 0}
                    icon="✅"
                    color="green"
                />
                <StatCard
                    label="مسودة"
                    value={stats?.draftProducts || 0}
                    icon="📝"
                    color="yellow"
                />
                <StatCard
                    label="الفئات"
                    value={stats?.totalCategories || 0}
                    icon="📁"
                    href="/admin/categories"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة منتج
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 px-5 py-3 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        إدارة الفئات
                    </Link>
                </div>
            </div>

            {/* Recent Products */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">آخر المنتجات</h2>
                    <Link href="/admin/products" className="text-red-500 text-sm hover:underline">
                        عرض الكل
                    </Link>
                </div>

                <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
                    {recentProducts.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {recentProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">
                                            {product.name_ar || product.name}
                                        </div>
                                        <div className="text-neutral-500 text-sm">
                                            {product.price > 0 ? `${product.price} ر.س` : 'بدون سعر'}
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs ${product.status === 'published'
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {product.status === 'published' ? 'منشور' : 'مسودة'}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-neutral-500">
                            لا توجد منتجات بعد
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({
    label,
    value,
    icon,
    href,
    color = 'default'
}: {
    label: string;
    value: number;
    icon: string;
    href?: string;
    color?: 'default' | 'green' | 'yellow';
}) {
    const colors = {
        default: 'bg-neutral-900',
        green: 'bg-green-500/10',
        yellow: 'bg-yellow-500/10',
    };

    const Content = () => (
        <div className={`${colors[color]} rounded-2xl border border-white/5 p-5 ${href ? 'hover:border-white/10 transition-colors' : ''}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                {href && (
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" stroke Width={2} d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-neutral-500 text-sm mt-1">{label}</div>
        </div>
    );

    if (href) {
        return <Link href={href}><Content /></Link>;
    }
    return <Content />;
}

function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-8 animate-pulse">
            <div>
                <div className="h-8 w-32 bg-neutral-800 rounded" />
                <div className="h-4 w-48 bg-neutral-800 rounded mt-2" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-neutral-900 rounded-2xl p-5 h-32" />
                ))}
            </div>
            <div className="bg-neutral-900 rounded-2xl h-64" />
        </div>
    );
}
