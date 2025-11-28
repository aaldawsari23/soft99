/**
 * API Provider (Placeholder)
 * 
 * مزود البيانات عبر API - للاستخدام المستقبلي
 * حالياً غير مفعّل - المشروع يستخدم Firestore مباشرة
 * Ready for future backend integration
/**
 * API Provider (Placeholder)
 * 
 * مزود البيانات عبر API - للاستخدام المستقبلي
 * حالياً غير مفعّل - المشروع يستخدم Firestore مباشرة
 * Ready for future backend integration
 */

import { DataProvider } from './types';
import { Product, Category, Brand, ProductFilters, Order } from '@/types';

export const apiProvider: DataProvider = {
  // --- Products ---
  async getProducts(_filters?: ProductFilters): Promise<Product[]> {
    throw new Error('API Provider not implemented');
  },
  async getProductById(_id: string): Promise<Product | null> {
    throw new Error('API Provider not implemented');
  },
  async createProduct(_product): Promise<Product> {
    throw new Error('API Provider not implemented');
  },
  async updateProduct(_id: string, _product): Promise<Product> {
    throw new Error('API Provider not implemented');
  },
  async deleteProduct(_id: string): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    throw new Error('API Provider not implemented');
  },
  async getCategoryById(_id: string): Promise<Category | null> {
    throw new Error('API Provider not implemented');
  },
  async createCategory(_category): Promise<Category> {
    throw new Error('API Provider not implemented');
  },
  async updateCategory(_id: string, _category): Promise<Category> {
    throw new Error('API Provider not implemented');
  },
  async deleteCategory(_id: string): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Brands ---
  async getBrands(): Promise<Brand[]> {
    throw new Error('API Provider not implemented');
  },
  async getBrandById(_id: string): Promise<Brand | null> {
    throw new Error('API Provider not implemented');
  },
  async createBrand(_brand): Promise<Brand> {
    throw new Error('API Provider not implemented');
  },
  async updateBrand(_id: string, _brand): Promise<Brand> {
    throw new Error('API Provider not implemented');
  },
  async deleteBrand(_id: string): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Orders ---
  async getOrders(_userId?: string): Promise<Order[]> {
    throw new Error('API Provider not implemented');
  },
  async getOrderById(_id: string): Promise<Order | null> {
    throw new Error('API Provider not implemented');
  },
  async createOrder(_order): Promise<Order> {
    throw new Error('API Provider not implemented');
  },
  async updateOrder(_id: string, _order): Promise<Order> {
    throw new Error('API Provider not implemented');
  }
};
