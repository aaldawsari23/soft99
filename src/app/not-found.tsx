import Link from 'next/link';
import { products } from '@/data/products';

export default function NotFound() {
  // Get some random products to suggest
  const randomProducts = products
    .filter(p => p.status === 'published')
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="bg-background-light border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="سوفت تسعة وتسعين" className="h-10 w-10 rounded-md" />
            <span className="text-primary font-bold text-lg">سوفت تسعة وتسعين</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md mx-auto mb-8">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-4">الصفحة غير موجودة</h1>
          <p className="text-text-secondary mb-8">
            عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-6 py-3">
              العودة للرئيسية 🏠
            </Link>
            <Link href="/catalog" className="btn-secondary px-6 py-3">
              تصفح المنتجات 🛍️
            </Link>
          </div>
        </div>

        {/* Suggested products */}
        {randomProducts.length > 0 && (
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">منتجات قد تهمك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {randomProducts.map(product => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  className="card p-4 hover:border-primary transition-colors"
                >
                  <div className="h-32 bg-gray-900 rounded-lg mb-3 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">🏍️</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {product.name_ar}
                  </h3>
                  <p className="text-green-400 font-bold text-lg">
                    {product.price.toLocaleString('ar-SA')} {product.currency}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}