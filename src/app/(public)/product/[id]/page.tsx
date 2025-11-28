import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetails from './ProductDetails';
import { getDataProvider } from '@/lib/data-providers';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const dataProvider = getDataProvider();
  const product = await dataProvider.getProductById(id);

  if (!product) {
    return { title: 'المنتج غير موجود' };
  }

  return {
    title: `${product.name_ar || product.name_en} | سوفت 99`,
    description: product.short_description || product.description?.slice(0, 160),
    openGraph: {
      title: product.name_ar || product.name_en,
      description: product.description?.slice(0, 200),
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const dataProvider = getDataProvider();

  // Fetch product
  const product = await dataProvider.getProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch brand and category
  let brand = null;
  let category = undefined;

  if (product.brand_id) {
    try {
      brand = await dataProvider.getBrandById(product.brand_id);
    } catch (e) {
      console.error('Error fetching brand', e);
    }
  }

  if (product.category_id) {
    try {
      category = await dataProvider.getCategoryById(product.category_id);
    } catch (e) {
      console.error('Error fetching category', e);
    }
  }

  // Get related products (same category)
  let relatedProducts: import('@/types').Product[] = [];
  if (product.category_id) {
    try {
      const allProducts = await dataProvider.getProducts({ category: product.category_id, status: 'published' });
      relatedProducts = allProducts
        .filter(p => p.id !== product.id && (p.is_available ?? true))
        .slice(0, 5);
    } catch (e) {
      console.error('Error fetching related products', e);
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_ar || product.name_en || product.name || 'منتج',
    description: product.short_description || product.description,
    sku: product.sku || product.id,
    image: product.images?.length ? product.images : product.image_url ? [product.image_url] : undefined,
    brand: brand
      ? {
        '@type': 'Brand',
        name: brand.name,
      }
      : undefined,
    category: category?.name_ar,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency || 'SAR',
      price: product.price,
      availability: product.is_available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <ProductDetails
        product={product}
        brand={brand || null}
        category={category || undefined}
        relatedProducts={relatedProducts}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
