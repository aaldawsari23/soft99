import { ProductGridSkeleton } from '@/components/ui/ProductSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="bg-background-light border-b border-gray-800 h-16 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gray-800 rounded-md animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="hidden md:flex gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-16 w-16 bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-800 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-800 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-6 w-48 bg-gray-800 rounded mb-6 animate-pulse"></div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}