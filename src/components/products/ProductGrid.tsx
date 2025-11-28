import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 md:p-16 text-center border border-white/10">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-5xl md:text-6xl mb-4 animate-float">🔍</div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">لا توجد منتجات متاحة</h3>
          <p className="text-text-secondary text-sm md:text-base">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {title && (
        <h2 className="section-title animate-slide-down">{title}</h2>
      )}
      {/* Modern responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
