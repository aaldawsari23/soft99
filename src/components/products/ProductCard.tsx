'use client';

import Link from 'next/link';
import { memo } from 'react';
import type { MouseEvent } from 'react';
import { Product } from '@/types';
import { LazyProductImage } from '@/components/ui/LazyProductImage';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { categories, brands } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const displayName = product.name_ar || product.name_en || 'منتج';
  const isAvailable = product.is_available ?? true;
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();

  const category = categories.find(c => c.id === product.category_id);
  const brand = brands.find(b => b.id === product.brand_id);

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showToast(`تم إضافة "${displayName}" إلى السلة`, 'success');
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group h-full block"
      aria-label={`عرض تفاصيل ${displayName}`}
    >
      <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 active:border-primary/70 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98]">
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background to-background-light aspect-square">
          <LazyProductImage product={product} alt={displayName} />

          {/* Quick Add Button - visible on mobile, enhanced on hover - Hidden for motorcycles */}
          {isAvailable && product.type !== 'bike' && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-primary/90 backdrop-blur-sm text-white p-2 rounded-lg opacity-70 md:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:scale-110 active:scale-95"
              aria-label="أضف للسلة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1 bg-danger text-white text-xs md:text-sm font-bold rounded-lg">
                غير متوفر
              </span>
            </div>
          )}
        </div>

        {/* Content - Compact - Flex to push price to bottom */}
        <div className="flex-1 flex flex-col p-3 md:p-4 space-y-2">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 text-xs">
            {category && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {category.name_ar}
              </span>
            )}
            {brand && (
              <span className="text-text-muted">{brand.name}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {displayName}
          </h3>

          {/* SKU & Info */}
          <div className="space-y-1 text-xs text-text-muted">
            {(product.sku || product.id) && (
              <div>SKU: <span className="text-white">{product.sku || product.id}</span></div>
            )}
            {product.specifications?.model && (
              <div>موديل: <span className="text-white">{product.specifications.model}</span></div>
            )}
          </div>

          {/* Spacer to push price to bottom */}
          <div className="flex-1"></div>

          {/* Price */}
          {product.price > 0 && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-lg md:text-xl font-bold text-green-500">{product.price.toLocaleString('ar-SA')} {product.currency}</span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {isAvailable && (
              <div className="flex items-center gap-1 text-success text-[10px] md:text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                <span>متوفر</span>
              </div>
            )}
            {isInCart(product.id) && (
              <div className="flex items-center gap-1 text-yellow-500 text-[10px] md:text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                <span>في السلة</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
