/**
 * Local Data Provider
 *
 * مزود البيانات المحلي - يقرأ من JSON ويحفظ في localStorage أثناء التطوير
 * يمكن استبداله بمزود API لاحقاً دون تغيير المكونات
 */

import { Product, Category, Brand, ProductFilters, Order } from '@/types';
import { DataProvider } from './types';
import { filterProducts } from '@/utils/catalog';

// استيراد البيانات الأولية
import productsData from '@/../public/data/products.json';
import { categories as initialCategories, brands as initialBrands } from '@/data/products';

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
  PRODUCTS: 'soft99_products',
  CATEGORIES: 'soft99_categories',
  BRANDS: 'soft99_brands',
  ORDERS: 'soft99_orders',
} as const;

/**
 * مزود البيانات المحلي
 */
class LocalDataProvider implements DataProvider {
  private cache: {
    products: Product[] | null;
    categories: Category[] | null;
    brands: Brand[] | null;
    orders: Order[] | null;
  } = {
      products: null,
      categories: null,
      brands: null,
      orders: null,
    };

  /**
   * تحميل البيانات من localStorage أو JSON
   */
  private loadFromStorage<T>(key: string, fallback: T[]): T[] {
    // في بيئة SSR، نعيد البيانات الأولية
    if (typeof window === 'undefined') {
      return fallback;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
    }

    return fallback;
  }

  /**
   * حفظ البيانات في localStorage
   */
  private saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }

  /**
   * تنظيف بيانات المنتج - إزالة undefined من specifications
   */
  private cleanProduct(product: Product): Product {
    const cleaned = { ...product };

    // تنظيف specifications - إزالة undefined
    if (cleaned.specifications) {
      cleaned.specifications = Object.fromEntries(
        Object.entries(cleaned.specifications).filter(([, v]) => v !== undefined)
      );
    }

    // تنظيف specs - إزالة undefined
    if (cleaned.specs) {
      cleaned.specs = Object.fromEntries(
        Object.entries(cleaned.specs).filter(([, v]) => v !== undefined)
      );
    }

    return cleaned as unknown as Product;
  }

  /**
   * الحصول على المنتجات مع الفلاتر
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // تحميل من الكاش أو التخزين
    if (!this.cache.products) {
      const rawProducts = this.loadFromStorage(
        STORAGE_KEYS.PRODUCTS,
        productsData as unknown as Product[]
      );

      // تنظيف البيانات
      this.cache.products = rawProducts.map(p => this.cleanProduct(p));
    }

    let products = [...this.cache.products];

    // تطبيق الفلاتر
    if (filters) {
      products = filterProducts(products, filters);
    }

    return products;
  }

  /**
   * الحصول على منتج بالمعرف
   */
  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  /**
   * إنشاء منتج جديد
   */
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const products = await this.getProducts();

    // توليد ID جديد
    const newId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // إضافة المنتج الجديد
    this.cache.products = [...products, newProduct];
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.cache.products);

    return newProduct;
  }

  /**
   * تحديث منتج
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct: Product = {
      ...products[index],
      ...updates,
      id, // الحفاظ على نفس المعرف
      updated_at: new Date().toISOString(),
    };

    this.cache.products = [
      ...products.slice(0, index),
      updatedProduct,
      ...products.slice(index + 1),
    ];

    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.cache.products);

    return updatedProduct;
  }

  /**
   * حذف منتج
   */
  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
      return false; // لم يتم العثور على المنتج
    }

    this.cache.products = filtered;
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.cache.products);

    return true;
  }

  /**
   * الحصول على الفئات
   */
  async getCategories(): Promise<Category[]> {
    if (!this.cache.categories) {
      this.cache.categories = this.loadFromStorage(
        STORAGE_KEYS.CATEGORIES,
        initialCategories
      );
    }

    return [...this.cache.categories];
  }

  /**
   * الحصول على فئة بالمعرف
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find(c => c.id === id) || null;
  }

  /**
   * إنشاء فئة جديدة
   */
  async createCategory(categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const categories = await this.getCategories();

    const newCategory: Category = {
      ...categoryData,
      id: `c_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    this.cache.categories = [...categories, newCategory];
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.cache.categories);

    return newCategory;
  }

  /**
   * تحديث فئة
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }

    const updatedCategory: Category = {
      ...categories[index],
      ...updates,
      id,
    };

    this.cache.categories = [
      ...categories.slice(0, index),
      updatedCategory,
      ...categories.slice(index + 1),
    ];

    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.cache.categories);

    return updatedCategory;
  }

  /**
   * حذف فئة
   */
  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);

    if (filtered.length === categories.length) {
      return false;
    }

    this.cache.categories = filtered;
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, this.cache.categories);

    return true;
  }

  /**
   * الحصول على العلامات التجارية
   */
  async getBrands(): Promise<Brand[]> {
    if (!this.cache.brands) {
      this.cache.brands = this.loadFromStorage(
        STORAGE_KEYS.BRANDS,
        initialBrands
      );
    }

    return [...this.cache.brands];
  }

  /**
   * الحصول على علامة تجارية بالمعرف
   */
  async getBrandById(id: string): Promise<Brand | null> {
    const brands = await this.getBrands();
    return brands.find(b => b.id === id) || null;
  }

  /**
   * إنشاء علامة تجارية جديدة
   */
  async createBrand(brandData: Omit<Brand, 'id' | 'created_at'>): Promise<Brand> {
    const brands = await this.getBrands();

    const newBrand: Brand = {
      ...brandData,
      id: `b_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    this.cache.brands = [...brands, newBrand];
    this.saveToStorage(STORAGE_KEYS.BRANDS, this.cache.brands);

    return newBrand;
  }

  /**
   * تحديث علامة تجارية
   */
  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
    const brands = await this.getBrands();
    const index = brands.findIndex(b => b.id === id);

    if (index === -1) {
      throw new Error(`Brand with id ${id} not found`);
    }

    const updatedBrand: Brand = {
      ...brands[index],
      ...updates,
      id,
    };

    this.cache.brands = [
      ...brands.slice(0, index),
      updatedBrand,
      ...brands.slice(index + 1),
    ];

    this.saveToStorage(STORAGE_KEYS.BRANDS, this.cache.brands);

    return updatedBrand;
  }

  /**
   * حذف علامة تجارية
   */
  async deleteBrand(id: string): Promise<boolean> {
    const brands = await this.getBrands();
    const filtered = brands.filter(b => b.id !== id);

    if (filtered.length === brands.length) {
      return false;
    }

    this.cache.brands = filtered;
    this.saveToStorage(STORAGE_KEYS.BRANDS, this.cache.brands);

    return true;
  }

  /**
   * الحصول على الطلبات
   */
  async getOrders(userId?: string): Promise<Order[]> {
    if (!this.cache.orders) {
      this.cache.orders = this.loadFromStorage(STORAGE_KEYS.ORDERS, []);
    }

    let orders = [...this.cache.orders];
    if (userId) {
      orders = orders.filter(o => o.user_id === userId);
    }
    return orders;
  }

  /**
   * الحصول على طلب بالمعرف
   */
  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  /**
   * إنشاء طلب جديد
   */
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const orders = await this.getOrders();

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending'
    };

    this.cache.orders = [...orders, newOrder];
    this.saveToStorage(STORAGE_KEYS.ORDERS, this.cache.orders);

    return newOrder;
  }

  /**
   * تحديث طلب
   */
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) {
      throw new Error(`Order with id ${id} not found`);
    }

    const updatedOrder: Order = {
      ...orders[index],
      ...updates,
      id,
      updated_at: new Date().toISOString(),
    };

    this.cache.orders = [
      ...orders.slice(0, index),
      updatedOrder,
      ...orders.slice(index + 1),
    ];

    this.saveToStorage(STORAGE_KEYS.ORDERS, this.cache.orders);

    return updatedOrder;
  }

  /**
   * مسح الكاش
   */
  clearCache(): void {
    this.cache = {
      products: null,
      categories: null,
      brands: null,
      orders: null,
    };
  }

  /**
   * إعادة تحميل البيانات من المصدر
   */
  async reload(): Promise<void> {
    this.clearCache();

    // إعادة تحميل البيانات
    await Promise.all([
      this.getProducts(),
      this.getCategories(),
      this.getBrands(),
    ]);
  }
}

// تصدير instance واحد
export const localProvider = new LocalDataProvider();
