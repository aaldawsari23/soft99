import { filterProducts, sortProducts, getRelatedProducts } from '@/utils/catalog';
import { Product } from '@/types';

describe('catalog utils', () => {
  const baseProduct: Product = {
    id: '1',
    category_id: 'cat-1',
    brand_id: 'brand-1',
    type: 'bike',
    price: 1200,
    currency: 'SAR',
    description: 'دراجة رياضية',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    name_ar: 'دراجة 1',
    status: 'published',
  };

  const products: Product[] = [
    baseProduct,
    {
      ...baseProduct,
      id: '2',
      price: 800,
      status: 'published',
      name_ar: 'دراجة 2',
      is_featured: true,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
    },
    {
      ...baseProduct,
      id: '3',
      price: 1500,
      brand_id: 'brand-2',
      category_id: 'cat-2',
      name_ar: 'دراجة 3',
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
    },
  ];

  it('filters by status and search', () => {
    const filtered = filterProducts(products, { status: 'published', search: '3' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('3');
  });

  it('filters featured items', () => {
    const filtered = filterProducts(products, { isFeatured: true });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('sorts by price descending', () => {
    const sorted = sortProducts(products, 'price-desc');
    expect(sorted[0].price).toBe(1500);
    expect(sorted[sorted.length - 1].price).toBe(800);
  });

  it('finds related products in same category or brand', () => {
    const related = getRelatedProducts(products[0], products, 2);
    expect(related.some((p) => p.id === '2')).toBe(true);
  });
});
