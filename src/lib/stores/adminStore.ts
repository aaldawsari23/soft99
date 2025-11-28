/**
 * Admin Store - Zustand
 *
 * إدارة حالة لوحة التحكم باستخدام Zustand
 * تتيح تخزين ومشاركة البيانات بين مختلف صفحات لوحة التحكم
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category, Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';

const dataProvider = getDataProvider();

interface AdminState {
  // البيانات
  products: Product[];
  categories: Category[];
  brands: Brand[];

  // حالة التحميل
  isLoading: boolean;
  error: string | null;

  // إجراءات المنتجات
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;

  // إجراءات الفئات
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;

  // إجراءات العلامات التجارية
  loadBrands: () => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id' | 'created_at'>) => Promise<Brand>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<Brand>;
  deleteBrand: (id: string) => Promise<boolean>;

  // إجراءات عامة
  loadAllData: () => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      products: [],
      categories: [],
      brands: [],
      isLoading: false,
      error: null,

      // تحميل المنتجات
      loadProducts: async () => {
        try {
          set({ isLoading: true, error: null });
          const products = await dataProvider.getProducts();
          set({ products, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحميل المنتجات',
            isLoading: false,
          });
        }
      },

      // إضافة منتج
      addProduct: async (productData) => {
        try {
          set({ isLoading: true, error: null });
          const newProduct = await dataProvider.createProduct(productData);
          set((state) => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
          return newProduct;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في إضافة المنتج',
            isLoading: false,
          });
          throw error;
        }
      },

      // تحديث منتج
      updateProduct: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedProduct = await dataProvider.updateProduct(id, updates);
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            isLoading: false,
          }));
          return updatedProduct;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحديث المنتج',
            isLoading: false,
          });
          throw error;
        }
      },

      // حذف منتج
      deleteProduct: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const success = await dataProvider.deleteProduct(id);
          if (success) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
              isLoading: false,
            }));
          }
          return success;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في حذف المنتج',
            isLoading: false,
          });
          return false;
        }
      },

      // الحصول على منتج بالمعرف
      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      // تحميل الفئات
      loadCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await dataProvider.getCategories();
          set({ categories, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحميل الفئات',
            isLoading: false,
          });
        }
      },

      // إضافة فئة
      addCategory: async (categoryData) => {
        try {
          set({ isLoading: true, error: null });
          const newCategory = await dataProvider.createCategory(categoryData);
          set((state) => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }));
          return newCategory;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في إضافة الفئة',
            isLoading: false,
          });
          throw error;
        }
      },

      // تحديث فئة
      updateCategory: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedCategory = await dataProvider.updateCategory(id, updates);
          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
            isLoading: false,
          }));
          return updatedCategory;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحديث الفئة',
            isLoading: false,
          });
          throw error;
        }
      },

      // حذف فئة
      deleteCategory: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const success = await dataProvider.deleteCategory(id);
          if (success) {
            set((state) => ({
              categories: state.categories.filter((c) => c.id !== id),
              isLoading: false,
            }));
          }
          return success;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في حذف الفئة',
            isLoading: false,
          });
          return false;
        }
      },

      // تحميل العلامات التجارية
      loadBrands: async () => {
        try {
          set({ isLoading: true, error: null });
          const brands = await dataProvider.getBrands();
          set({ brands, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحميل العلامات التجارية',
            isLoading: false,
          });
        }
      },

      // إضافة علامة تجارية
      addBrand: async (brandData) => {
        try {
          set({ isLoading: true, error: null });
          const newBrand = await dataProvider.createBrand(brandData);
          set((state) => ({
            brands: [...state.brands, newBrand],
            isLoading: false,
          }));
          return newBrand;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في إضافة العلامة التجارية',
            isLoading: false,
          });
          throw error;
        }
      },

      // تحديث علامة تجارية
      updateBrand: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedBrand = await dataProvider.updateBrand(id, updates);
          set((state) => ({
            brands: state.brands.map((b) => (b.id === id ? updatedBrand : b)),
            isLoading: false,
          }));
          return updatedBrand;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحديث العلامة التجارية',
            isLoading: false,
          });
          throw error;
        }
      },

      // حذف علامة تجارية
      deleteBrand: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const success = await dataProvider.deleteBrand(id);
          if (success) {
            set((state) => ({
              brands: state.brands.filter((b) => b.id !== id),
              isLoading: false,
            }));
          }
          return success;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في حذف العلامة التجارية',
            isLoading: false,
          });
          return false;
        }
      },

      // تحميل جميع البيانات
      loadAllData: async () => {
        try {
          set({ isLoading: true, error: null });
          const [products, categories, brands] = await Promise.all([
            dataProvider.getProducts(),
            dataProvider.getCategories(),
            dataProvider.getBrands(),
          ]);
          set({ products, categories, brands, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'خطأ في تحميل البيانات',
            isLoading: false,
          });
        }
      },

      // مسح الخطأ
      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-storage', // اسم المفتاح في localStorage
      partialize: (state) => ({
        // حفظ البيانات فقط في localStorage، وليس الحالة
        products: state.products,
        categories: state.categories,
        brands: state.brands,
      }),
    }
  )
);
