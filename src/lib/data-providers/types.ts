/**
 * Data Provider Types
 *
 * هذا الملف يحدد واجهات موحدة لمزودي البيانات
 * يمكن استبدال المزود المحلي بمزود API لاحقاً بسهولة
 */

import { Product, Category, Brand, ProductFilters, Order } from '@/types';

/**
 * واجهة مزود البيانات الأساسية
 */
export interface DataProvider {
  // المنتجات
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;

  // الفئات
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  // العلامات التجارية
  getBrands(): Promise<Brand[]>;
  getBrandById(id: string): Promise<Brand | null>;
  createBrand(brand: Omit<Brand, 'id' | 'created_at'>): Promise<Brand>;
  updateBrand(id: string, brand: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<boolean>;

  // الطلبات
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order>;
}

/**
 * نوع إعدادات المزود
 */
export interface ProviderConfig {
  source: 'local' | 'api' | 'firestore';
  apiUrl?: string;
  apiKey?: string;
}

/**
 * نتيجة العمليات على البيانات
 */
export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
