export default function ProductSkeleton() {
  return (
    <div className="product-card animate-pulse">
      {/* Image skeleton */}
      <div className="h-40 sm:h-44 md:h-48 bg-gray-800 rounded-lg mb-3"></div>
      
      {/* Content skeleton */}
      <div className="px-1">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-800 rounded mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-3/4 mb-3"></div>
        
        {/* Specs skeleton */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-1/3"></div>
            <div className="h-3 bg-gray-800 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-1/4"></div>
            <div className="h-3 bg-gray-800 rounded w-1/3"></div>
          </div>
        </div>
        
        {/* Price skeleton */}
        <div className="pt-3 border-t border-gray-800">
          <div className="h-6 bg-gray-800 rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}