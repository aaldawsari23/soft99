'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import FilterDropdown from '@/components/ui/FilterDropdown';
import { Product, Category, Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { filterProducts, sortProducts } from '@/utils/catalog';

const ITEMS_PER_PAGE = 20;

export default function CatalogContent() {
  const dataProviderRef = useRef(getDataProvider());
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from URL params
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>(
    sortParam as 'newest' | 'price-asc' | 'price-desc' | 'name'
  );
  const [currentPage, setCurrentPage] = useState(1);

  // State for data from provider
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from provider on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [productsData, categoriesData, brandsData] = await Promise.all([
          dataProviderRef.current.getProducts({ status: 'published' }),
          dataProviderRef.current.getCategories(),
          dataProviderRef.current.getBrands(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, selectedBrand, sortBy, pathname, router]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (isLoading || products.length === 0) return [];

    let filtered = filterProducts(products, {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      brand: selectedBrand !== 'all' ? selectedBrand : undefined,
      status: 'published',
    });

    filtered = sortProducts(filtered, sortBy);
    return filtered;
  }, [products, selectedCategory, selectedBrand, sortBy, isLoading]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, sortBy]);

  // Paginate the filtered products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Category options for dropdown
  const categoryOptions = categories.map(cat => ({
    id: cat.id,
    label: cat.name_ar
  }));

  // Brand options for dropdown
  const brandOptions = brands.map(brand => ({
    id: brand.id,
    label: brand.name
  }));

  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'الأحدث' },
    { id: 'price-asc', label: 'السعر: من الأقل' },
    { id: 'price-desc', label: 'السعر: من الأعلى' },
    { id: 'name', label: 'الاسم' },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-40 bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-10 w-40 bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-10 w-40 bg-neutral-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="الفئة"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <FilterDropdown
          label="الماركة"
          options={brandOptions}
          value={selectedBrand}
          onChange={setSelectedBrand}
        />

        <FilterDropdown
          label="الترتيب"
          options={sortOptions}
          value={sortBy}
          onChange={(value) => setSortBy(value as typeof sortBy)}
        />

        <div className="mr-auto text-sm text-neutral-400">
          {filteredProducts.length} منتج
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-500">لا توجد منتجات</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
          >
            السابق
          </button>

          <span className="px-4 py-2 text-neutral-400">
            صفحة {currentPage} من {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
