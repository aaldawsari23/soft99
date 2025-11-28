// =============================================================================
// 📁 src/data/config.ts - توحيد الإعدادات
// =============================================================================

export const STORE = {
  name: 'Soft99',
  tagline: 'قطع غيار الدراجات النارية',
  domain: 'soft99.sa',
  whatsapp: '966568663381',
  whatsapp2: '966580874790',
  location: {
    city: 'جيزان',
    address: 'بجوار مستشفى العميس',
    maps: 'https://maps.app.goo.gl/t6pyLPj52d18BaPH6',
    coordinates: { lat: 16.9064, lng: 42.5525 }
  },
  hours: {
    open: '17:30',
    close: '03:00',
    display: 'يومياً من 5:30 عصراً حتى 3:00 فجراً'
  },
  social: {
    snapchat: 'h5jk6'
  }
} as const;

// =============================================================================
// 📁 src/components/layout/Navbar.tsx - النسخة الجديدة المبسطة
// =============================================================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { STORE } from '@/data/config';
import SearchModal from '@/components/ui/SearchModal';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // فتح البحث بـ Cmd+K أو Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/catalog', label: 'المنتجات' },
    { href: '/contact', label: 'تواصل معنا' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 h-16 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500/50 transition-colors">
              <Image
                src="/Logo.png"
                alt={STORE.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
              {STORE.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="بحث"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="السلة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="القائمة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-950 border-b border-white/5 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-3 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {mounted && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </>
  );
}

// =============================================================================
// 📁 src/components/ui/SearchModal.tsx - بحث ذكي
// =============================================================================

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
      <div className="relative max-w-xl mx-auto mt-20 mx-4">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                      index === selectedIndex ? 'bg-white/5' : 'hover:bg-white/5'
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
                          e.currentTarget.src = getFallbackImageSrc();
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
                لا توجد نتائج لـ "{query}"
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

// =============================================================================
// 📁 src/components/products/ProductCard.tsx - كارت بسيط
// =============================================================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { getProductImageSrc, getFallbackImageSrc } from '@/utils/imageHelper';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);
  
  const displayName = product.name_ar || product.name || 'منتج';
  const shortDesc = product.short_description || product.description?.slice(0, 50);
  const imageSrc = imageError ? getFallbackImageSrc() : getProductImageSrc(product);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCart) {
      showToast('المنتج موجود في السلة', 'info');
      return;
    }
    
    addToCart(product);
    showToast('تم الإضافة للسلة', 'success');
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-neutral-900 rounded-xl border border-white/5 overflow-hidden hover:border-red-500/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-neutral-800 overflow-hidden">
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-2 left-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              inCart 
                ? 'bg-green-500 text-white' 
                : 'bg-white/90 text-neutral-900 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
            }`}
            aria-label={inCart ? 'في السلة' : 'إضافة للسلة'}
          >
            {inCart ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-1 group-hover:text-red-500 transition-colors">
            {displayName}
          </h3>
          
          {shortDesc && (
            <p className="text-neutral-500 text-xs mt-1 line-clamp-1">
              {shortDesc}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            {product.price > 0 ? (
              <span className="text-green-500 font-bold">
                {product.price.toLocaleString('ar-SA')} <span className="text-xs font-normal">ر.س</span>
              </span>
            ) : (
              <span className="text-neutral-500 text-sm">اتصل للسعر</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// 📁 src/components/ui/FilterDropdown.tsx - فلتر بسيط
// =============================================================================

'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white hover:border-white/20 transition-colors"
      >
        <span className="text-neutral-400">{label}:</span>
        <span>{selectedOption?.label || 'الكل'}</span>
        <svg 
          className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-xl z-20 py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2 text-right text-sm transition-colors ${
              value === 'all' ? 'text-red-500 bg-red-500/10' : 'text-neutral-300 hover:bg-white/5'
            }`}
          >
            الكل
          </button>
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => { onChange(option.id); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-right text-sm transition-colors ${
                value === option.id ? 'text-red-500 bg-red-500/10' : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 📁 src/app/globals.css - الألوان الجديدة (أضف في البداية)
// =============================================================================

/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 220 38 38;
    --color-success: 34 197 94;
    --color-warning: 245 158 11;
    --color-error: 239 68 68;
  }
  
  body {
    @apply bg-neutral-950 text-white antialiased;
    font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
  }

  * {
    @apply border-neutral-800;
  }
}

@layer components {
  .btn-primary {
    @apply bg-red-600 text-white font-medium px-6 py-3 rounded-xl 
           hover:bg-red-700 active:scale-[0.98] transition-all;
  }
  
  .btn-secondary {
    @apply bg-neutral-800 text-white font-medium px-6 py-3 rounded-xl 
           border border-white/10 hover:bg-neutral-700 active:scale-[0.98] transition-all;
  }
  
  .input-field {
    @apply w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 
           text-white placeholder-neutral-500 outline-none
           focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all;
  }
  
  .card {
    @apply bg-neutral-900 border border-white/5 rounded-2xl p-6;
  }
}
*/
