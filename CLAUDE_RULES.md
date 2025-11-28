# Soft99bikes - AI Development Rules

## Project Overview
- **Type**: E-commerce store for motorcycle parts
- **Stack**: Next.js 15, TypeScript, Tailwind CSS, Firebase
- **Language**: Arabic (RTL) primary, English secondary

## Critical Rules

### 1. Data Access Pattern
```typescript
// ALWAYS use Data Provider
import { getDataProvider } from '@/lib/data-providers';
const provider = getDataProvider();

// NEVER import Firebase directly in components
// ❌ import { db } from '@/lib/firebase';
```

### 2. Type Safety
```typescript
// ALWAYS import types from central location
import { Product, Category, Brand } from '@/types';

// NEVER use `any` type
// ALWAYS define proper interfaces
```

### 3. Component Structure
```typescript
// Client components that need hooks
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getDataProvider } from '@/lib/data-providers';

export default function MyComponent() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const provider = getDataProvider();
        const result = await provider.getProducts();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطأ غير متوقع');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  
  return (/* JSX */);
}
```

### 4. Styling Rules
- Use existing Tailwind classes from `globals.css`
- Use `card`, `btn-primary`, `btn-secondary`, `input-field` classes
- Always support RTL (use `gap`, `space-x` carefully)
- Dark theme is default - use `bg-background`, `text-white`, etc.

### 5. Error Handling
```typescript
// Use toast for user feedback
import { toast } from 'react-hot-toast';

try {
  await someAction();
  toast.success('تمت العملية بنجاح');
} catch (error) {
  toast.error('حدث خطأ. يرجى المحاولة مرة أخرى');
  console.error('Action failed:', error);
}
```

### 6. File Organization
```
New Feature Checklist:
□ Types in src/types/index.ts
□ Data methods in src/lib/data-providers/
□ UI components in src/components/
□ Pages in src/app/
□ Tests in __tests__/ folders
```

### 7. Arabic Text
- Product names: `name_ar` field
- UI text: Hardcode in Arabic
- Dates: Use `toLocaleDateString('ar-SA')`
- Numbers: Use `toLocaleString('ar-SA')`

### 8. Testing Requirements
```typescript
// Minimum tests for new features:
- [ ] Component renders without crash
- [ ] Loading state displays
- [ ] Error state displays
- [ ] Main functionality works
```

## Common Patterns

### Filtering Products
```typescript
import { filterProducts, sortProducts } from '@/utils/catalog';

const filtered = filterProducts(products, {
  category: selectedCategory !== 'all' ? selectedCategory : undefined,
  status: 'published',
  search: searchQuery || undefined,
});

const sorted = sortProducts(filtered, 'newest');
```

### Form Handling
```typescript
const [formData, setFormData] = useState<FormState>(initialState);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  
  setIsSubmitting(true);
  try {
    await submitAction(formData);
    toast.success('تم الحفظ بنجاح');
    router.push('/success-page');
  } catch (error) {
    toast.error('فشل الحفظ');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Image Handling
```typescript
import { LazyProductImage } from '@/components/ui/LazyProductImage';

// For products - use this component
<LazyProductImage product={product} alt={product.name_ar} />

// For image URLs
import { getProductImageSrc, getFallbackImageSrc } from '@/utils/imageHelper';
```

## Forbidden Patterns

1. ❌ Direct Firestore access in components
2. ❌ Using `any` type
3. ❌ Hardcoded colors (use Tailwind)
4. ❌ Console.log in production code
5. ❌ Missing loading/error states
6. ❌ Missing TypeScript types
7. ❌ Inline styles (use Tailwind)
8. ❌ Missing accessibility attributes

## Commands Reference

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm test             # Run tests
```
