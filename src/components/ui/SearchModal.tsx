'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';
import { getProductImageSrc, getFallbackImageSrc } from '@/utils/imageHelper';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search function
    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const provider = getDataProvider();
            const products = await provider.getProducts({
                status: 'published',
                search: searchQuery
            });
            setResults(products.slice(0, 6));
            setSelectedIndex(0);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => search(query), 300);
        return () => clearTimeout(timer);
    }, [query, search]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault();
            goToProduct(results[selectedIndex].id);
        }
    };

    const goToProduct = (id: string) => {
        router.push(`/product/${id}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative max-w-xl mx-auto mt-20 px-4">
                <div className="bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                        <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="ابحث عن منتج..."
                            className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none"
                        />
                        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-neutral-500 bg-neutral-800 rounded">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-neutral-500">
                                <div className="inline-block w-6 h-6 border-2 border-neutral-700 border-t-red-500 rounded-full animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map((product, index) => (
                                    <button
                                        key={product.id}
                                        onClick={() => goToProduct(product.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${index === selectedIndex ? 'bg-white/5' : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                                            <Image
                                                src={getProductImageSrc(product)}
                                                alt={product.name_ar || ''}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = getFallbackImageSrc();
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate">
                                                {product.name_ar || product.name}
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                {product.price > 0 && `${product.price} ر.س`}
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        ) : query.trim() ? (
                            <div className="p-8 text-center text-neutral-500">
                                لا توجد نتائج لـ &quot;{query}&quot;
                            </div>
                        ) : (
                            <div className="p-6 text-center text-neutral-500 text-sm">
                                ابدأ الكتابة للبحث عن المنتجات
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    {results.length > 0 && (
                        <div className="px-4 py-2 border-t border-white/5 text-xs text-neutral-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">↓</kbd>
                                للتنقل
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Enter</kbd>
                                للفتح
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
