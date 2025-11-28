import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DataProvider } from './types';
import { Product, Category, Brand, ProductFilters } from '@/types';

const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BRANDS_COL = 'brands';

export const firestoreProvider: DataProvider = {
    // --- Products ---
    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        try {
            const constraints: QueryConstraint[] = [];
            const productsRef = collection(db, PRODUCTS_COL);

            // Basic filtering
            if (filters?.category && filters.category !== 'all') {
                constraints.push(where('category_id', '==', filters.category));
            }
            if (filters?.brand && filters.brand !== 'all') {
                constraints.push(where('brand_id', '==', filters.brand));
            }
            if (filters?.type) {
                constraints.push(where('type', '==', filters.type));
            }
            if (filters?.status) {
                constraints.push(where('status', '==', filters.status));
            }
            if (filters?.isFeatured) {
                constraints.push(where('is_featured', '==', true));
            }
            if (filters?.isNew) {
                constraints.push(where('is_new', '==', true));
            }

            const q = query(productsRef, ...constraints);
            const snapshot = await getDocs(q);

            let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

            // In-memory filtering for ranges and search
            if (filters) {
                if (filters.minPrice !== undefined) {
                    products = products.filter(p => p.price >= filters.minPrice!);
                }
                if (filters.maxPrice !== undefined) {
                    products = products.filter(p => p.price <= filters.maxPrice!);
                }
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    products = products.filter(p =>
                        p.name_ar?.toLowerCase().includes(searchLower) ||
                        p.name_en?.toLowerCase().includes(searchLower) ||
                        p.description?.toLowerCase().includes(searchLower)
                    );
                }
                if (filters.stockStatus) {
                    products = products.filter(p => p.stock_status === filters.stockStatus);
                }
            }

            return products;
        } catch (error) {
            console.error('خطأ في جلب المنتجات:', error);
            throw new Error('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
        }
    },

    async getProductById(id: string): Promise<Product | null> {
        try {
            const docRef = doc(db, PRODUCTS_COL, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
        } catch (error) {
            console.error(`خطأ في جلب المنتج ${id}:`, error);
            throw new Error('فشل في تحميل تفاصيل المنتج. يرجى المحاولة مرة أخرى.');
        }
    },

    async createProduct(product): Promise<Product> {
        try {
            const now = new Date().toISOString();
            const docRef = await addDoc(collection(db, PRODUCTS_COL), {
                ...product,
                created_at: now,
                updated_at: now
            });
            return { id: docRef.id, ...product, created_at: now, updated_at: now } as Product;
        } catch (error) {
            console.error('خطأ في إنشاء المنتج:', error);
            throw new Error('فشل في إضافة المنتج. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
        }
    },

    async updateProduct(id: string, product): Promise<Product> {
        try {
            const docRef = doc(db, PRODUCTS_COL, id);
            const updates = {
                ...product,
                updated_at: new Date().toISOString()
            };
            await updateDoc(docRef, updates);

            const updatedSnap = await getDoc(docRef);
            if (!updatedSnap.exists()) {
                throw new Error('المنتج غير موجود بعد التحديث');
            }
            return { id: updatedSnap.id, ...updatedSnap.data() } as Product;
        } catch (error) {
            console.error(`خطأ في تحديث المنتج ${id}:`, error);
            throw new Error('فشل في تحديث المنتج. يرجى المحاولة مرة أخرى.');
        }
    },

    async deleteProduct(id: string): Promise<boolean> {
        try {
            const docRef = doc(db, PRODUCTS_COL, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const product = docSnap.data() as Product;

                // Delete images from storage
                if (product.images && product.images.length > 0) {
                    const { deleteImage } = await import('@/lib/storage');
                    await Promise.all(product.images.map(url => deleteImage(url)));
                }

                await deleteDoc(docRef);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`خطأ في حذف المنتج ${id}:`, error);
            throw new Error('فشل في حذف المنتج. يرجى المحاولة مرة أخرى.');
        }
    },

    // --- Categories ---
    async getCategories(): Promise<Category[]> {
        try {
            const snapshot = await getDocs(collection(db, CATEGORIES_COL));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        } catch (error) {
            console.error('خطأ في جلب الفئات:', error);
            throw new Error('فشل في تحميل الفئات. يرجى المحاولة مرة أخرى.');
        }
    },

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const docRef = doc(db, CATEGORIES_COL, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Category) : null;
        } catch (error) {
            console.error(`خطأ في جلب الفئة ${id}:`, error);
            throw new Error('فشل في تحميل تفاصيل الفئة. يرجى المحاولة مرة أخرى.');
        }
    },

    async createCategory(category): Promise<Category> {
        try {
            const now = new Date().toISOString();
            const docRef = await addDoc(collection(db, CATEGORIES_COL), {
                ...category,
                created_at: now
            });
            return { id: docRef.id, ...category, created_at: now } as Category;
        } catch (error) {
            console.error('خطأ في إنشاء الفئة:', error);
            throw new Error('فشل في إضافة الفئة. يرجى المحاولة مرة أخرى.');
        }
    },

    async updateCategory(id: string, category): Promise<Category> {
        try {
            const docRef = doc(db, CATEGORIES_COL, id);
            await updateDoc(docRef, category);
            const updatedSnap = await getDoc(docRef);
            if (!updatedSnap.exists()) {
                throw new Error('الفئة غير موجودة بعد التحديث');
            }
            return { id: updatedSnap.id, ...updatedSnap.data() } as Category;
        } catch (error) {
            console.error(`خطأ في تحديث الفئة ${id}:`, error);
            throw new Error('فشل في تحديث الفئة. يرجى المحاولة مرة أخرى.');
        }
    },

    async deleteCategory(id: string): Promise<boolean> {
        try {
            await deleteDoc(doc(db, CATEGORIES_COL, id));
            return true;
        } catch (error) {
            console.error(`خطأ في حذف الفئة ${id}:`, error);
            throw new Error('فشل في حذف الفئة. يرجى المحاولة مرة أخرى.');
        }
    },

    // --- Brands ---
    async getBrands(): Promise<Brand[]> {
        try {
            const snapshot = await getDocs(collection(db, BRANDS_COL));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
        } catch (error) {
            console.error('خطأ في جلب العلامات التجارية:', error);
            throw new Error('فشل في تحميل العلامات التجارية. يرجى المحاولة مرة أخرى.');
        }
    },

    async getBrandById(id: string): Promise<Brand | null> {
        try {
            const docRef = doc(db, BRANDS_COL, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Brand) : null;
        } catch (error) {
            console.error(`خطأ في جلب العلامة التجارية ${id}:`, error);
            throw new Error('فشل في تحميل تفاصيل العلامة التجارية. يرجى المحاولة مرة أخرى.');
        }
    },

    async createBrand(brand): Promise<Brand> {
        try {
            const now = new Date().toISOString();
            const docRef = await addDoc(collection(db, BRANDS_COL), {
                ...brand,
                created_at: now
            });
            return { id: docRef.id, ...brand, created_at: now } as Brand;
        } catch (error) {
            console.error('خطأ في إنشاء العلامة التجارية:', error);
            throw new Error('فشل في إضافة العلامة التجارية. يرجى المحاولة مرة أخرى.');
        }
    },

    async updateBrand(id: string, brand): Promise<Brand> {
        try {
            const docRef = doc(db, BRANDS_COL, id);
            await updateDoc(docRef, brand);
            const updatedSnap = await getDoc(docRef);
            if (!updatedSnap.exists()) {
                throw new Error('العلامة التجارية غير موجودة بعد التحديث');
            }
            return { id: updatedSnap.id, ...updatedSnap.data() } as Brand;
        } catch (error) {
            console.error(`خطأ في تحديث العلامة التجارية ${id}:`, error);
            throw new Error('فشل في تحديث العلامة التجارية. يرجى المحاولة مرة أخرى.');
        }
    },

    async deleteBrand(id: string): Promise<boolean> {
        try {
            await deleteDoc(doc(db, BRANDS_COL, id));
            return true;
        } catch (error) {
            console.error(`خطأ في حذف العلامة التجارية ${id}:`, error);
            throw new Error('فشل في حذف العلامة التجارية. يرجى المحاولة مرة أخرى.');
        }
    }
};
