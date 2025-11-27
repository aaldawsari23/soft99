'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product, Brand } from '@/types';
import Link from 'next/link';
import { LazyProductImage } from '@/components/ui/LazyProductImage';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { getDataProvider } from '@/lib/data-providers';

const ITEMS_PER_PAGE = 12;

export default function MotorcyclesPage() {
  const [condition, setCondition] = useState<'all' | 'new' | 'used'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCC, setSelectedCC] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const dataProvider = getDataProvider();
        const [productsData, brandsData] = await Promise.all([
          dataProvider.getProducts({ category: 'motorcycles', status: 'published' }),
          dataProvider.getBrands(),
        ]);
        setProducts(productsData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading motorcycles:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Get motorcycles only (already filtered by API, but good to be safe)
  const motorcycles = useMemo(() => {
    return products.filter(p => (p.category_id === 'motorcycles' || p.type === 'bike') && p.status === 'published');
  }, [products]);

  // Extract unique values for filters
  const availableBrands = useMemo(() => {
    const brandIds = new Set(motorcycles.map(m => m.brand_id).filter(Boolean));
    return brands.filter(b => brandIds.has(b.id));
  }, [motorcycles, brands]);

  const availableTypes = useMemo(() => {
    const types = new Set(
      motorcycles
        .map(m => m.specifications?.type)
        .filter(Boolean) as string[]
    );
    return Array.from(types);
  }, [motorcycles]);

  const ccRanges = [
    { id: '125-250', label: '125 - 250 سي سي', min: 125, max: 250 },
    { id: '251-600', label: '251 - 600 سي سي', min: 251, max: 600 },
    { id: '601-750', label: '601 - 750 سي سي', min: 601, max: 750 },
    { id: '751-1000', label: '751 - 1000 سي سي', min: 751, max: 1000 },
    { id: '1001-1300', label: '1001 - 1300 سي سي', min: 1001, max: 1300 },
    { id: '1301+', label: '1301+ سي سي', min: 1301, max: 99999 },
  ];

  // Filter motorcycles
  const filteredMotorcycles = useMemo(() => {
    let filtered = [...motorcycles];

    // Condition filter
    if (condition === 'new') {
      filtered = filtered.filter(m => m.is_new === true);
    } else if (condition === 'used') {
      filtered = filtered.filter(m => m.is_new === false);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(m => m.brand_id === selectedBrand);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.specifications?.type === selectedType);
    }

    // CC range filter
    if (selectedCC !== 'all') {
      const range = ccRanges.find(r => r.id === selectedCC);
      if (range) {
        filtered = filtered.filter(m => {
          const cc = parseInt(m.specifications?.cc || '0');
          return cc >= range.min && cc <= range.max;
        });
      }
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [motorcycles, condition, selectedBrand, selectedType, selectedCC]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [condition, selectedBrand, selectedType, selectedCC]);

  // Paginate
  const paginatedMotorcycles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMotorcycles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMotorcycles, currentPage]);

  const totalPages = Math.ceil(filteredMotorcycles.length / ITEMS_PER_PAGE);

  // Count by filter
  const newCount = motorcycles.filter(m => m.is_new === true).length;
  const usedCount = motorcycles.filter(m => m.is_new === false).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">دراجات نارية</h1>
          <p className="text-text-secondary">تصفح دراجاتنا النارية الجديدة والمستعملة</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6 space-y-4">
          {/* Condition Filter - Prominent */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">الحالة</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCondition('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${condition === 'all'
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-background/50 text-text-muted border border-white/10 hover:border-primary/30 hover:text-white active:scale-95'
                  }`}
              >
                الكل ({motorcycles.length})
              </button>
              <button
                onClick={() => setCondition('new')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${condition === 'new'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                  : 'bg-background/50 text-text-muted border border-white/10 hover:border-green-500/30 hover:text-white active:scale-95'
                  }`}
              >
                جديد ({newCount})
              </button>
              <button
                onClick={() => setCondition('used')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${condition === 'used'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-background/50 text-text-muted border border-white/10 hover:border-orange-500/30 hover:text-white active:scale-95'
                  }`}
              >
                مستعمل ({usedCount})
              </button>
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div>
              <h3 className="text-xs text-text-muted font-semibold mb-2">العلامة التجارية</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedBrand === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                    }`}
                >
                  الكل
                </button>
                {availableBrands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedBrand === brand.id
                      ? 'bg-primary text-white'
                      : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                      }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type Filter */}
          {availableTypes.length > 0 && (
            <div>
              <h3 className="text-xs text-text-muted font-semibold mb-2">النوع</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedType === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                    }`}
                >
                  الكل
                </button>
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedType === type
                      ? 'bg-primary text-white'
                      : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CC Range Filter */}
          <div>
            <h3 className="text-xs text-text-muted font-semibold mb-2">السعة (CC)</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCC('all')}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedCC === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                  }`}
              >
                الكل
              </button>
              {ccRanges.map(range => (
                <button
                  key={range.id}
                  onClick={() => setSelectedCC(range.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${selectedCC === range.id
                    ? 'bg-primary text-white'
                    : 'bg-background/50 text-text-muted border border-white/10 hover:text-white'
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results & Clear */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              <span className="text-primary font-bold">{filteredMotorcycles.length}</span> دراجة
            </p>
            {(condition !== 'all' || selectedBrand !== 'all' || selectedType !== 'all' || selectedCC !== 'all') && (
              <button
                onClick={() => {
                  setCondition('all');
                  setSelectedBrand('all');
                  setSelectedType('all');
                  setSelectedCC('all');
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                مسح الفلاتر ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {paginatedMotorcycles.map(bike => {
            const displayName = bike.name_ar || bike.name || 'دراجة نارية';
            const brand = brands.find(b => b.id === bike.brand_id);
            const cc = bike.specifications?.cc;
            const year = bike.specifications?.year;
            const mileage = bike.specifications?.mileage;

            return (
              <Link
                key={bike.id}
                href={`/product/${bike.id}`}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-background to-background-light overflow-hidden">
                  <LazyProductImage product={bike} alt={displayName} />
                  {/* Condition Badge */}
                  <div className="absolute top-2 right-2">
                    {bike.is_new ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        جديد
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        مستعمل
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1 mb-1">
                      {displayName}
                    </h3>
                    {brand && (
                      <p className="text-sm text-primary">{brand.name}</p>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {year && (
                      <span className="px-2 py-1 bg-white/10 text-white rounded">
                        {year}
                      </span>
                    )}
                    {cc && (
                      <span className="px-2 py-1 bg-white/10 text-white rounded">
                        {cc} سي سي
                      </span>
                    )}
                    {!bike.is_new && mileage && (
                      <span className="px-2 py-1 bg-white/10 text-white rounded">
                        {mileage}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  {bike.price > 0 && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-2xl font-bold text-green-500">
                        {bike.price.toLocaleString('ar-SA')} <span className="text-base">ر.س</span>
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {paginatedMotorcycles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🏍️</div>
            <p className="text-text-secondary">لا توجد دراجات تطابق الفلاتر المحددة</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${currentPage === 1
                  ? 'bg-background/30 text-text-muted cursor-not-allowed opacity-50'
                  : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-semibold">السابق</span>
              </button>

              <div className="text-center">
                <p className="text-sm text-text-muted">
                  صفحة <span className="text-primary font-bold text-lg mx-1">{currentPage}</span>
                  من <span className="text-primary font-bold text-lg mx-1">{totalPages}</span>
                </p>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${currentPage === totalPages
                  ? 'bg-background/30 text-text-muted cursor-not-allowed opacity-50'
                  : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                  }`}
              >
                <span className="text-sm font-semibold">التالي</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
}
