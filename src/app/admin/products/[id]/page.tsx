'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setIsLoading(true);
                setError(null);
                const provider = getDataProvider();
                const data = await provider.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error('Error loading product:', err);
                setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتج');
            } finally {
                setIsLoading(false);
            }
        }
        if (id) {
            load();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="h-8 w-48 bg-neutral-800 rounded" />
                    <div className="bg-neutral-900 rounded-2xl h-96" />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || 'المنتج غير موجود'}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary"
                    >
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <ProductForm initialData={product} />
        </div>
    );
}
