import { z } from 'zod';

/**
 * Product Validation Schemas
 * مخططات التحقق من صحة بيانات المنتجات
 */

// Product Type enum
export const productTypeSchema = z.enum(['bike', 'part', 'gear'] as const, {
  message: 'نوع المنتج يجب أن يكون: دراجة، قطعة غيار، أو معدات',
});

// Stock Status enum
export const stockStatusSchema = z.enum(['available', 'unavailable'] as const, {
  message: 'حالة المخزون يجب أن تكون: متوفر أو غير متوفر',
});

// Product Status enum
export const productStatusSchema = z.enum(['published', 'hidden'] as const, {
  message: 'حالة المنتج يجب أن تكون: منشور أو مخفي',
});

/**
 * Schema للتحقق من بيانات المنتج عند الإنشاء
 */
export const createProductSchema = z.object({
  sku: z.string().optional(),
  name_ar: z
    .string()
    .min(3, 'اسم المنتج يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'اسم المنتج يجب ألا يتجاوز 200 حرف'),
  name_en: z.string().max(200, 'اسم المنتج بالإنجليزية يجب ألا يتجاوز 200 حرف').optional(),
  category_id: z.string().min(1, 'يجب اختيار الفئة'),
  brand_id: z.string().optional(),
  type: productTypeSchema,
  price: z
    .number()
    .min(0, 'السعر يجب أن يكون صفر أو أكثر')
    .max(1000000, 'السعر يجب ألا يتجاوز مليون'),
  currency: z.string().default('SAR'),
  is_new: z.boolean().optional().default(false),
  is_featured: z.boolean().optional().default(false),
  is_available: z.boolean().optional().default(true),
  stock_status: stockStatusSchema.optional().default('available'),
  stock_quantity: z.number().int().min(0, 'الكمية يجب أن تكون صفر أو أكثر').optional(),
  status: productStatusSchema.optional().default('published'),
  specifications: z.record(z.string(), z.string()).optional(),
  description: z
    .string()
    .min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل')
    .max(5000, 'الوصف يجب ألا يتجاوز 5000 حرف'),
  short_description: z.string().max(500, 'الوصف المختصر يجب ألا يتجاوز 500 حرف').optional(),
  images: z.array(z.string().url('يجب أن يكون رابط صورة صحيح')).optional(),
  image_url: z.string().url('يجب أن يكون رابط الصورة صحيح').optional(),
  remoteImageUrl: z.string().url('يجب أن يكون رابط الصورة صحيح').optional(),
  salla_url: z.string().url('يجب أن يكون رابط سلة صحيح').optional(),
});

/**
 * Schema للتحقق من بيانات المنتج عند التحديث
 */
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, 'معرف المنتج مطلوب'),
});

/**
 * Schema للتحقق من معرف المنتج
 */
export const productIdSchema = z.object({
  id: z.string().min(1, 'معرف المنتج مطلوب'),
});

/**
 * Schema للتحقق من فلاتر المنتجات
 */
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  type: productTypeSchema.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  stockStatus: stockStatusSchema.optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
  status: productStatusSchema.optional(),
});

/**
 * Helper function للتحقق من بيانات المنتج
 */
export function validateProduct(data: unknown) {
  return createProductSchema.parse(data);
}

/**
 * Helper function للتحقق من بيانات تحديث المنتج
 */
export function validateProductUpdate(data: unknown) {
  return updateProductSchema.parse(data);
}

/**
 * Safe parsing مع إرجاع الأخطاء
 */
export function safeValidateProduct(data: unknown) {
  return createProductSchema.safeParse(data);
}

/**
 * Safe parsing لتحديث المنتج
 */
export function safeValidateProductUpdate(data: unknown) {
  return updateProductSchema.safeParse(data);
}

// Export types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
