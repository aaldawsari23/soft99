import { z } from 'zod';
import { productTypeSchema } from './product';

/**
 * Category Validation Schemas
 * مخططات التحقق من صحة بيانات الفئات
 */

/**
 * Schema للتحقق من بيانات الفئة عند الإنشاء
 */
export const createCategorySchema = z.object({
  name_ar: z
    .string()
    .min(2, 'اسم الفئة يجب أن يكون حرفين على الأقل')
    .max(100, 'اسم الفئة يجب ألا يتجاوز 100 حرف'),
  name_en: z.string().max(100, 'اسم الفئة بالإنجليزية يجب ألا يتجاوز 100 حرف').optional(),
  type: productTypeSchema,
  icon: z.string().optional(),
  description: z.string().max(500, 'الوصف يجب ألا يتجاوز 500 حرف').optional(),
});

/**
 * Schema للتحقق من بيانات الفئة عند التحديث
 */
export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'معرف الفئة مطلوب'),
});

/**
 * Schema للتحقق من معرف الفئة
 */
export const categoryIdSchema = z.object({
  id: z.string().min(1, 'معرف الفئة مطلوب'),
});

/**
 * Helper function للتحقق من بيانات الفئة
 */
export function validateCategory(data: unknown) {
  return createCategorySchema.parse(data);
}

/**
 * Helper function للتحقق من بيانات تحديث الفئة
 */
export function validateCategoryUpdate(data: unknown) {
  return updateCategorySchema.parse(data);
}

/**
 * Safe parsing مع إرجاع الأخطاء
 */
export function safeValidateCategory(data: unknown) {
  return createCategorySchema.safeParse(data);
}

/**
 * Safe parsing لتحديث الفئة
 */
export function safeValidateCategoryUpdate(data: unknown) {
  return updateCategorySchema.safeParse(data);
}

// Export types
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
