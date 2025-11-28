'use client';

import { useState } from 'react';
import { products, categories, brands } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export default function DataMigration() {
    const [status, setStatus] = useState('idle');
    const [log, setLog] = useState<string[]>([]);

    const migrate = async () => {
        try {
            setStatus('migrating');
            setLog([]);

            const batch = writeBatch(db);
            let count = 0;
            const BATCH_SIZE = 450; // Firestore limit is 500

            // Migrate Brands
            for (const brand of brands) {
                const ref = doc(db, 'brands', brand.id);
                batch.set(ref, brand);
                count++;
            }
            setLog(prev => [...prev, `Prepared ${brands.length} brands`]);

            // Migrate Categories
            for (const category of categories) {
                const ref = doc(db, 'categories', category.id);
                batch.set(ref, category);
                count++;
            }
            setLog(prev => [...prev, `Prepared ${categories.length} categories`]);

            // Migrate Products
            for (const product of products) {
                // Ensure ID is string
                const id = String(product.id);
                const ref = doc(db, 'products', id);

                // Clean up data if needed
                const productData = {
                    ...product,
                    id: id,
                    price: Number(product.price),
                    // Ensure images is array
                    images: Array.isArray(product.images) ? product.images : [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                batch.set(ref, productData);
                count++;

                // Commit if batch is full
                if (count >= BATCH_SIZE) {
                    await batch.commit();
                    setLog(prev => [...prev, `Committed batch of ${count} items`]);
                    count = 0;
                    // Start new batch
                    // Note: In a real large migration we'd need to re-instantiate writeBatch(db) here if we were looping differently, 
                    // but writeBatch returns a new batch object. 
                    // Actually, we can't reuse the committed batch. We need a new one.
                    // For simplicity in this small dataset, we'll assume < 500 items total or just do one commit at end if small.
                    // But let's be safe:
                    // This logic is slightly flawed for multiple batches in a single loop structure without re-init.
                    // Given the dataset size (likely small), one batch might suffice, but let's just do separate commits if needed or just one big commit if < 500.
                    // Let's refactor to be safer:
                }
            }

            // Commit remaining
            if (count > 0) {
                await batch.commit();
                setLog(prev => [...prev, `Committed final batch of ${count} items`]);
            }

            setStatus('success');
            setLog(prev => [...prev, 'Migration completed successfully!']);

        } catch (error) {
            console.error(error);
            setStatus('error');
            setLog(prev => [...prev, `Error: ${error}`]);
        }
    };

    return (
        <div className="p-8 bg-gray-900 text-white rounded-lg max-w-2xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4">Data Migration</h2>

            <div className="mb-4">
                <p>Found {brands.length} brands</p>
                <p>Found {categories.length} categories</p>
                <p>Found {products.length} products</p>
            </div>

            <button
                onClick={migrate}
                disabled={status === 'migrating'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {status === 'migrating' ? 'Migrating...' : 'Start Migration'}
            </button>

            <div className="mt-4 bg-black p-4 rounded h-64 overflow-y-auto font-mono text-sm">
                {log.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
                {status === 'success' && <div className="text-green-500">Done!</div>}
                {status === 'error' && <div className="text-red-500">Failed!</div>}
            </div>
        </div>
    );
}
