'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import FilterDropdown from '@/components/ui/FilterDropdown';
import { Product, Category, Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { filterProducts, sortProducts } from '@/utils/catalog';

const ITEMS_PER_PAGE = 20;

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export default function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters from URL
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'newest';
  const [currentPage, setCurrentPage] = useState(1);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const provider = getDataProvider();
        const [productsData, categoriesData, brandsData] = await Promise.all([
          provider.getProducts({ status: 'published' }),
          provider.getCategories(),
          provider.getBrands(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading catalog:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update URL
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'newest') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setCurrentPage(1);
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = filterProducts(products, {
      category: categoryParam !== 'all' ? categoryParam : undefined,
      brand: brandParam !== 'all' ? brandParam : undefined,
      status: 'published',
    });
    return sortProducts(result, sortParam);
  }, [products, categoryParam, brandParam, sortParam]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Category options
  const categoryOptions = useMemo(
    () => categories.map(c => ({ id: c.id, label: c.name_ar })),
    [categories]
  );

  // Brand options (only show brands with products)
  const brandOptions = useMemo(() => {
    const brandIds = new Set(products.map(p => p.brand_id).filter(Boolean));
    return brands
      .filter(b => brandIds.has(b.id))
      .map(b => ({ id: b.id, label: b.name }));
  }, [brands, products]);

  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'الأحدث' },
    { id: 'price-asc', label: 'السعر: من الأقل' },
    { id: 'price-desc', label: 'السعر: من الأعلى' },
    { id: 'name', label: 'الاسم' },
  ];

  if (isLoading) {
    return <CatalogLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">المنتجات</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {filteredProducts.length} منتج
          </p>
        </div>
      </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="الفئة"
            options={categoryOptions}
            value={categoryParam}
            onChange={(v) => updateFilters('category', v)}
          />
          {brandOptions.length > 1 && (
            <FilterDropdown
              label="الماركة"
              options={brandOptions}
              value={brandParam}
              onChange={(v) => updateFilters('brand', v)}
            />
          )}
          <FilterDropdown
            label="الترتيب"
            options={sortOptions}
            value={sortParam}
            onChange={(v) => updateFilters('sort', v)}
          />
        </div>
      </div>

      {/* Active Filters */}
      {(categoryParam !== 'all' || brandParam !== 'all') && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-500 text-sm">الفلاتر:</span>
          {categoryParam !== 'all' && (
            <FilterChip
              label={categories.find(c => c.id === categoryParam)?.name_ar || categoryParam}
              onRemove={() => updateFilters('category', 'all')}
            />
          )}
          {brandParam !== 'all' && (
            <FilterChip
              label={brands.find(b => b.id === brandParam)?.name || brandParam}
              onRemove={() => updateFilters('brand', 'all')}
            />
          )}
          <button
            onClick={() => {
              router.replace(pathname, { scroll: false });
              setCurrentPage(1);
            }}
            className="text-red-500 text-sm hover:underline"
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 text-sm rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-red-400">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات</h3>
      <p className="text-neutral-500">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page: number;
          if (totalPages <= 5) {
            page = i + 1;
          } else if (currentPage <= 3) {
            page = i + 1;
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i;
          } else {
            page = currentPage - 2 + i;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function CatalogLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-neutral-800 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-neutral-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
