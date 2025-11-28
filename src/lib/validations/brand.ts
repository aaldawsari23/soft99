import { z } from 'zod';

/**
 * Brand Validation Schemas
 * مخططات التحقق من صحة بيانات الماركات
 */

/**
 * Schema للتحقق من بيانات الماركة عند الإنشاء
 */
export const createBrandSchema = z.object({
  name: z
    .string()
    .min(2, 'اسم الماركة يجب أن يكون حرفين على الأقل')
    .max(100, 'اسم الماركة يجب ألا يتجاوز 100 حرف'),
  name_ar: z.string().max(100, 'اسم الماركة بالعربية يجب ألا يتجاوز 100 حرف').optional(),
  name_en: z.string().max(100, 'اسم الماركة بالإنجليزية يجب ألا يتجاوز 100 حرف').optional(),
  logo_url: z.string().url('يجب أن يكون رابط اللوجو صحيح').optional(),
  description: z.string().max(500, 'الوصف يجب ألا يتجاوز 500 حرف').optional(),
});

/**
 * Schema للتحقق من بيانات الماركة عند التحديث
 */
export const updateBrandSchema = createBrandSchema.partial().extend({
  id: z.string().min(1, 'معرف الماركة مطلوب'),
});

/**
 * Schema للتحقق من معرف الماركة
 */
export const brandIdSchema = z.object({
  id: z.string().min(1, 'معرف الماركة مطلوب'),
});

/**
 * Helper function للتحقق من بيانات الماركة
 */
export function validateBrand(data: unknown) {
  return createBrandSchema.parse(data);
}

/**
 * Helper function للتحقق من بيانات تحديث الماركة
 */
export function validateBrandUpdate(data: unknown) {
  return updateBrandSchema.parse(data);
}

/**
 * Safe parsing مع إرجاع الأخطاء
 */
export function safeValidateBrand(data: unknown) {
  return createBrandSchema.safeParse(data);
}

/**
 * Safe parsing لتحديث الماركة
 */
export function safeValidateBrandUpdate(data: unknown) {
  return updateBrandSchema.safeParse(data);
}

// Export types
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
