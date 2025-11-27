import { db } from './firebase';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp
} from 'firebase/firestore';
import { Product } from '@/types';

// Collection references
const productsCol = collection(db, 'products');
const categoriesCol = collection(db, 'categories');
const brandsCol = collection(db, 'brands');

// --- Products ---

export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(productsCol, {
        ...product,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    });
    return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
        ...data,
        updated_at: Timestamp.now()
    });
}

export async function deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
}

// --- Stats ---

export async function getDashboardStats() {
    const productsSnap = await getDocs(productsCol);
    const categoriesSnap = await getDocs(categoriesCol);
    const brandsSnap = await getDocs(brandsCol);

    const products = productsSnap.docs.map(d => d.data() as Product);

    return {
        totalProducts: productsSnap.size,
        publishedProducts: products.filter(p => p.status === 'published').length,
        hiddenProducts: products.filter(p => p.status === 'hidden').length,
        totalCategories: categoriesSnap.size,
        totalBrands: brandsSnap.size,
        recentProducts: products.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        }).slice(0, 5)
    };
}
