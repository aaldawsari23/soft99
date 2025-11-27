import { Product } from '@/types';

/**
 * Gets the image source URL for a product.
 * Checks product properties in order of preference:
 * 1. remoteImageUrl - remote image URL if available
 * 2. image_url - local image URL if available
 * 3. Default fallback - generates URL based on product SKU
 *
 * @param product - The product object containing image information
 * @returns The image source URL as a string
 */
export function getProductImageSrc(product: Product): string {
  if (product.remoteImageUrl) {
    return product.remoteImageUrl;
  }

  if (product.image_url) {
    return product.image_url;
  }

  return `/images/${product.sku}.jpg`;
}

/**
 * Gets the fallback image source URL.
 * Used when no product image is available or as a loading placeholder.
 *
 * @returns The fallback image source URL as a string
 */
export function getFallbackImageSrc(): string {
  return '/images/placeholder.svg';
}
