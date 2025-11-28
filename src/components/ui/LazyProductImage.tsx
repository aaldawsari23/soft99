'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getProductImageSrc, getFallbackImageSrc } from '@/utils/imageHelper';
import { Product } from '@/types';

interface Props {
  product: Product;
  alt?: string;
}

export function LazyProductImage({ product, alt }: Props) {
  const [error, setError] = useState(false);

  const imageSrc = error ? getFallbackImageSrc() : getProductImageSrc(product);
  const imageAlt = alt || product.name_ar || product.name || 'منتج';

  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={300}
      height={300}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
}
