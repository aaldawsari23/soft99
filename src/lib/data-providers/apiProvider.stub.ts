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
import { Product, Category, Brand, Order } from '@/types';

export const apiProvider: DataProvider = {
  // --- Products ---
  async getProducts(/* filters */): Promise<Product[]> {
    throw new Error('API Provider not implemented');
  },
  async getProductById(/* id */): Promise<Product | null> {
    throw new Error('API Provider not implemented');
  },
  async createProduct(/* product */): Promise<Product> {
    throw new Error('API Provider not implemented');
  },
  async updateProduct(/* id, product */): Promise<Product> {
    throw new Error('API Provider not implemented');
  },
  async deleteProduct(/* id */): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    throw new Error('API Provider not implemented');
  },
  async getCategoryById(/* id */): Promise<Category | null> {
    throw new Error('API Provider not implemented');
  },
  async createCategory(/* category */): Promise<Category> {
    throw new Error('API Provider not implemented');
  },
  async updateCategory(/* id, category */): Promise<Category> {
    throw new Error('API Provider not implemented');
  },
  async deleteCategory(/* id */): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Brands ---
  async getBrands(): Promise<Brand[]> {
    throw new Error('API Provider not implemented');
  },
  async getBrandById(/* id */): Promise<Brand | null> {
    throw new Error('API Provider not implemented');
  },
  async createBrand(/* brand */): Promise<Brand> {
    throw new Error('API Provider not implemented');
  },
  async updateBrand(/* id, brand */): Promise<Brand> {
    throw new Error('API Provider not implemented');
  },
  async deleteBrand(/* id */): Promise<boolean> {
    throw new Error('API Provider not implemented');
  },

  // --- Orders ---
  async getOrders(/* userId */): Promise<Order[]> {
    throw new Error('API Provider not implemented');
  },
  async getOrderById(/* id */): Promise<Order | null> {
    throw new Error('API Provider not implemented');
  },
  async createOrder(/* order */): Promise<Order> {
    throw new Error('API Provider not implemented');
  },
  async updateOrder(/* id, order */): Promise<Order> {
    throw new Error('API Provider not implemented');
  }
};
