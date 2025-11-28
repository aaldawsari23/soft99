/**
 * API Provider (Placeholder)
 * 
 * مزود البيانات عبر API - للاستخدام المستقبلي
 * حالياً غير مفعّل - المشروع يستخدم Firestore مباشرة
 * Ready for future backend integration
 */

import { DataProvider } from './types';
import { Product, Category, Brand, ProductFilters } from '@/types';

function notImplemented(method: string): never {
  throw new Error(`API provider method "${method}" is not yet implemented. Please use firestoreProvider or localProvider instead.`);
}

export const apiProvider: DataProvider = {
  async getProducts(_filters?: ProductFilters): Promise<Product[]> {
    return notImplemented('getProducts');
  },

  async getProductById(_id: string): Promise<Product | null> {
    return notImplemented('getProductById');
  },

  async createProduct(_product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return notImplemented('createProduct');
  },

  async updateProduct(_id: string, _updates: Partial<Product>): Promise<Product> {
    return notImplemented('updateProduct');
  },

  async deleteProduct(_id: string): Promise<boolean> {
    return notImplemented('deleteProduct');
  },

  async getCategories(): Promise<Category[]> {
    return notImplemented('getCategories');
  },

  async getCategoryById(_id: string): Promise<Category | null> {
    return notImplemented('getCategoryById');
  },

  async createCategory(_category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    return notImplemented('createCategory');
  },

  async updateCategory(_id: string, _updates: Partial<Category>): Promise<Category> {
    return notImplemented('updateCategory');
  },

  async deleteCategory(_id: string): Promise<boolean> {
    return notImplemented('deleteCategory');
  },

  async getBrands(): Promise<Brand[]> {
    return notImplemented('getBrands');
  },

  async getBrandById(_id: string): Promise<Brand | null> {
    return notImplemented('getBrandById');
  },

  async createBrand(_brand: Omit<Brand, 'id' | 'created_at'>): Promise<Brand> {
    return notImplemented('createBrand');
  },

  async updateBrand(_id: string, _updates: Partial<Brand>): Promise<Brand> {
    return notImplemented('updateBrand');
  },

  async deleteBrand(_id: string): Promise<boolean> {
    return notImplemented('deleteBrand');
  },
};
