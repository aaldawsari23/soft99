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
