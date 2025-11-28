'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WHATSAPP_NUMBER } from '@/data/config';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { LazyProductImage } from '@/components/ui/LazyProductImage';
import { Product, Brand, Category } from '@/types';

interface ProductDetailsProps {
  product: Product;
  brand: Brand | null;
  category: Category | undefined;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, brand, category, relatedProducts }: ProductDetailsProps) {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const displayName = product.name_ar || product.name_en || 'منتج';
  const isAvailable = product.is_available ?? true;
  const isMotorcycle = product.type === 'bike';

  // Combine main image (if not in array) and images array
  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.image_url
      ? [product.image_url]
      : [];

  const handleBuyNow = () => {
    if (product.salla_url) {
      window.open(product.salla_url, '_blank');
    } else {
      const message = `مرحباً، أريد الاستفسار عن: ${displayName} - السعر: ${product.price} ${product.currency}`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`تم إضافة ${quantity} من "${displayName}" إلى السلة`, 'success');
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb - Compact */}
        <nav className="flex items-center gap-1.5 text-xs md:text-sm text-neutral-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-red-400 transition-colors">الرئيسية</Link>
          <span className="text-white/20">/</span>
          <Link href="/catalog" className="hover:text-red-400 transition-colors">المنتجات</Link>
          {category && (
            <>
              <span className="text-white/20">/</span>
              <span className="text-neutral-400">{category.name_ar}</span>
            </>
          )}
          <span className="text-white/20">/</span>
          <span className="text-white font-medium truncate max-w-[120px]">{displayName}</span>
        </nav>

        {/* Main Content - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 group">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={displayName}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <LazyProductImage product={product} alt={displayName} />
              )}

              {!isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <span className="px-6 py-3 bg-red-500 text-white text-xl font-bold rounded-2xl shadow-lg transform -rotate-12 border-2 border-white/20">
                    غير متوفر
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                        ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${displayName} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-4 md:mb-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {brand && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-400 text-xs rounded-lg">
                    {brand.name}
                  </span>
                )}
                {product.is_new && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-lg">
                    جديد
                  </span>
                )}
                {isAvailable ? (
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium rounded-lg">
                    متوفر
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium rounded-lg">
                    غير متوفر
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
                {displayName}
              </h1>

              {/* Price */}
              {product.price > 0 && (
                <div className="flex items-baseline gap-2 mb-4 md:mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-red-400">
                    {product.price.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-lg md:text-xl text-neutral-500">{product.currency}</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="prose prose-invert max-w-none mb-6 text-neutral-400 leading-relaxed bg-white/5 p-4 md:p-5 rounded-xl border border-white/5 text-sm md:text-base">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Specifications */}
              {((product.specs && Object.keys(product.specs).length > 0) || product.specifications) && (
                <div className="mb-6">
                  <h3 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                    المواصفات
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.specifications?.model && (
                      <div className="flex justify-between p-2.5 md:p-3 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-neutral-500 text-xs md:text-sm">الموديل</span>
                        <span className="text-white font-medium text-xs md:text-sm">{product.specifications.model}</span>
                      </div>
                    )}
                    {product.specifications?.specification && (
                      <div className="flex justify-between p-2.5 md:p-3 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-neutral-500 text-xs md:text-sm">المواصفة</span>
                        <span className="text-white font-medium text-xs md:text-sm">{product.specifications.specification}</span>
                      </div>
                    )}
                    {product.specs && Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2.5 md:p-3 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-neutral-500 text-xs md:text-sm">{key}</span>
                        <span className="text-white font-medium text-xs md:text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer (Sticky on Mobile) */}
            <div className="mt-auto sticky bottom-16 md:bottom-0 z-20 bg-neutral-950/95 backdrop-blur-xl p-3 md:p-4 -mx-4 border-t border-white/10 lg:static lg:bg-transparent lg:p-0 lg:border-0">
              <div className="flex flex-col sm:flex-row gap-3">
                {isMotorcycle ? (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all text-sm md:text-base"
                  >
                    {product.salla_url ? 'شراء الآن عبر سلة' : 'تواصل عبر واتساب'}
                  </button>
                ) : isAvailable ? (
                  <>
                    <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl hover:bg-white/10 rounded-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 md:w-12 text-center font-bold text-base md:text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl hover:bg-white/10 rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={isInCart(product.id)}
                      className="flex-1 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none text-sm md:text-base"
                    >
                      {isInCart(product.id) ? '✓ في السلة' : 'إضافة للسلة'}
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full py-3.5 bg-white/5 text-neutral-500 rounded-xl font-bold cursor-not-allowed border border-white/5 text-sm md:text-base">
                    غير متوفر حالياً
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/5">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">منتجات قد تعجبك</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {relatedProducts.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="aspect-square bg-background rounded-xl mb-4 overflow-hidden relative">
                    <LazyProductImage product={p} />
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {p.name_ar || p.name_en}
                  </h3>
                  {p.price > 0 && (
                    <p className="text-primary font-bold">{p.price.toLocaleString('ar-SA')} {p.currency}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
