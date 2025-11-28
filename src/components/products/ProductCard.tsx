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
      <article className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-neutral-800/50 overflow-hidden">
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-2 right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
              inCart
                ? 'bg-green-500 text-white scale-100 opacity-100'
                : 'bg-white/95 text-neutral-900 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 hover:bg-red-500 hover:text-white'
            }`}
            aria-label={inCart ? 'في السلة' : 'إضافة للسلة'}
          >
            {inCart ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>

          {/* New Badge */}
          {product.is_new && (
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
              جديد
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-red-400 transition-colors min-h-[2.5rem]">
            {displayName}
          </h3>

          {/* Brand/Category if available */}
          {(product.brand_id || product.category_id) && (
            <p className="text-neutral-500 text-xs line-clamp-1">
              {product.brand_id || product.category_id}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            {product.price > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-red-400 font-bold text-base">
                  {product.price.toLocaleString('ar-SA')}
                </span>
                <span className="text-neutral-500 text-[10px]">ر.س</span>
              </div>
            ) : (
              <span className="text-neutral-500 text-xs">اتصل للسعر</span>
            )}

            {/* CTA hint */}
            <span className="text-neutral-600 group-hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
