/**
 * Catalog Utilities
 *
 * دوال مساعدة لفلترة المنتجات وفرزها والبحث
 * منطق مركزي يستخدم من جميع المكونات
 */

import { Product, ProductFilters, SortOption, Brand } from '@/types';

/**
 * فلترة المنتجات حسب المعايير المختلفة
 */
export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let filtered = [...products];

  // فلتر الحالة (published/hidden) - مهم جداً!
  if (filters.status) {
    filtered = filtered.filter(p => p.status === filters.status);
  }

  // فلتر المنتجات المميزة
  if (filters.isFeatured !== undefined) {
    filtered = filtered.filter(p => p.is_featured === filters.isFeatured);
  }

  // فلتر الفئة
  if (filters.category) {
    filtered = filtered.filter(p => p.category_id === filters.category);
  }

  // فلتر العلامة التجارية
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand_id === filters.brand);
  }

  // فلتر النوع
  if (filters.type) {
    filtered = filtered.filter(p => p.type === filters.type);
  }

  // فلتر السعر الأدنى
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }

  // فلتر السعر الأعلى
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  // فلتر حالة المخزون
  if (filters.stockStatus) {
    filtered = filtered.filter(p => p.stock_status === filters.stockStatus);
  }

  // فلتر المنتجات الجديدة
  if (filters.isNew) {
    filtered = filtered.filter(p => p.is_new === true);
  }

  // البحث في النص
  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    filtered = filtered.filter(p => {
      // البحث في الاسم العربي
      const matchesNameAr = p.name_ar?.toLowerCase().includes(query);

      // البحث في الاسم الإنجليزي
      const matchesNameEn = p.name_en?.toLowerCase().includes(query);

      // البحث في الاسم العام (للتوافق)
      const matchesName = p.name?.toLowerCase().includes(query);

      // البحث في الوصف
      const matchesDescription = p.description?.toLowerCase().includes(query);

      // البحث في SKU
      const matchesSku = p.sku?.toLowerCase().includes(query);

      // البحث في رقم الموديل
      const matchesModel = p.specifications?.model?.toLowerCase().includes(query) ||
                          p.specs?.model?.toLowerCase().includes(query);

      return matchesNameAr || matchesNameEn || matchesName ||
             matchesDescription || matchesSku || matchesModel;
    });
  }

  return filtered;
}

/**
 * فرز المنتجات حسب خيار الفرز
 */
export function sortProducts(
  products: Product[],
  sortOption: SortOption = 'newest'
): Product[] {
  const sorted = [...products];

  switch (sortOption) {
    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name':
      return sorted.sort((a, b) => {
        const nameA = a.name_ar || a.name || '';
        const nameB = b.name_ar || b.name || '';
        return nameA.localeCompare(nameB, 'ar');
      });

    default:
      return sorted;
  }
}

/**
 * البحث في المنتجات بكلمات مفتاحية متعددة
 */
export function searchProducts(
  products: Product[],
  searchQuery: string,
  brands?: Brand[]
): Product[] {
  if (!searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();

  return products.filter(p => {
    // البحث في الاسم والوصف
    const matchesNameOrDesc =
      p.name?.toLowerCase().includes(query) ||
      p.name_ar?.toLowerCase().includes(query) ||
      p.name_en?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query);

    // البحث في SKU
    const matchesSku = p.sku?.toLowerCase().includes(query);

    // البحث في الموديل
    const matchesModel =
      p.specifications?.model?.toLowerCase().includes(query) ||
      p.specs?.model?.toLowerCase().includes(query);

    // البحث في اسم العلامة التجارية
    let matchesBrand = false;
    if (brands && p.brand_id) {
      const brand = brands.find(b => b.id === p.brand_id);
      matchesBrand = brand?.name.toLowerCase().includes(query) || false;
    }

    return matchesNameOrDesc || matchesSku || matchesModel || matchesBrand;
  });
}

/**
 * الحصول على نطاق السعر من قائمة المنتجات
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * الحصول على العلامات التجارية المتوفرة من قائمة المنتجات
 */
export function getAvailableBrands(
  products: Product[],
  allBrands: Brand[]
): Brand[] {
  const brandIds = new Set(products.map(p => p.brand_id).filter(Boolean));
  return allBrands.filter(b => brandIds.has(b.id));
}

/**
 * تجميع المنتجات حسب الفئة
 */
export function groupProductsByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce((acc, product) => {
    const categoryId = product.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
}

/**
 * تجميع المنتجات حسب العلامة التجارية
 */
export function groupProductsByBrand(products: Product[]): Record<string, Product[]> {
  return products.reduce((acc, product) => {
    const brandId = product.brand_id || 'unknown';
    if (!acc[brandId]) {
      acc[brandId] = [];
    }
    acc[brandId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
}

/**
 * الحصول على المنتجات المميزة
 */
export function getFeaturedProducts(products: Product[]): Product[] {
  return products.filter(p => p.is_featured === true);
}

/**
 * الحصول على المنتجات الجديدة
 */
export function getNewProducts(products: Product[]): Product[] {
  return products.filter(p => p.is_new === true);
}

/**
 * الحصول على المنتجات المتاحة فقط
 */
export function getAvailableProducts(products: Product[]): Product[] {
  return products.filter(p =>
    p.is_available === true ||
    p.stock_status === 'available' ||
    (p.stock_quantity && p.stock_quantity > 0)
  );
}

/**
 * الحصول على المنتجات المنشورة فقط
 */
export function getPublishedProducts(products: Product[]): Product[] {
  return products.filter(p => p.status === 'published');
}

/**
 * تقسيم المنتجات إلى صفحات
 */
export function paginateProducts(
  products: Product[],
  page: number = 1,
  itemsPerPage: number = 20
): {
  items: Product[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} {
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * itemsPerPage;
  const items = products.slice(start, start + itemsPerPage);

  return {
    items,
    totalPages,
    currentPage,
    totalItems,
  };
}

/**
 * الحصول على المنتجات المرتبطة (نفس الفئة أو العلامة التجارية)
 */
export function getRelatedProducts(
  product: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  return allProducts
    .filter(p =>
      p.id !== product.id &&
      p.status === 'published' &&
      (p.category_id === product.category_id || p.brand_id === product.brand_id)
    )
    .slice(0, limit);
}
