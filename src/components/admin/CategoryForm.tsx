'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Category, ProductType } from '@/types';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  initialData?: Category;
  onSubmit: (
    category: Omit<Category, 'id' | 'created_at'>
  ) => Promise<void>;
  onCancel?: () => void;
}

interface FormState {
  name_ar: string;
  name_en: string;
  type: ProductType;
  icon: string;
  description: string;
}

export default function CategoryForm({ mode, initialData, onSubmit, onCancel }: CategoryFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<FormState>(() => ({
    name_ar: initialData?.name_ar ?? '',
    name_en: initialData?.name_en ?? '',
    type: initialData?.type ?? 'part',
    icon: initialData?.icon ?? '',
    description: initialData?.description ?? '',
  }));

  const handleInputChange = (
    field: keyof FormState,
    value: string
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = (): string | null => {
    if (!formState.name_ar.trim()) return 'اسم الفئة (بالعربية) مطلوب';
    if (!formState.type) return 'نوع الفئة مطلوب';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const payload: Omit<Category, 'id' | 'created_at'> = {
      name_ar: formState.name_ar,
      name_en: formState.name_en || undefined,
      type: formState.type,
      icon: formState.icon || undefined,
      description: formState.description || undefined,
    };

    try {
      await onSubmit(payload);
      if (mode === 'create') {
        router.push('/admin/categories');
      }
    } catch (submitError) {
      console.error('Error saving category', submitError);
      setError('حدث خطأ أثناء حفظ الفئة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {mode === 'create' ? 'إضافة فئة جديدة' : 'تعديل الفئة'}
          </h2>
          {mode === 'edit' && initialData?.id && (
            <span className="text-xs text-text-muted">ID: {initialData.id}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* اسم الفئة بالعربية */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">اسم الفئة (عربي) *</label>
            <input
              className="input-field"
              value={formState.name_ar}
              onChange={(e) => handleInputChange('name_ar', e.target.value)}
              required
              placeholder="مثال: زيوت وسوائل"
            />
          </div>

          {/* اسم الفئة بالإنجليزية */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">اسم الفئة (إنجليزي)</label>
            <input
              className="input-field"
              value={formState.name_en}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              placeholder="Example: Oils & Fluids"
            />
          </div>

          {/* نوع الفئة */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">نوع الفئة *</label>
            <select
              className="input-field"
              value={formState.type}
              onChange={(e) => handleInputChange('type', e.target.value as ProductType)}
              required
            >
              <option value="part">قطع غيار</option>
              <option value="bike">دراجات نارية</option>
              <option value="gear">معدات وإكسسوارات</option>
            </select>
          </div>

          {/* أيقونة الفئة */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">أيقونة الفئة (Emoji)</label>
            <input
              className="input-field"
              value={formState.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              placeholder="مثال: 🛢️"
              maxLength={5}
            />
          </div>
        </div>

        {/* الوصف */}
        <div className="space-y-1 mt-4">
          <label className="text-sm text-text-secondary">وصف الفئة</label>
          <textarea
            className="input-field min-h-[100px]"
            value={formState.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="وصف مختصر للفئة..."
          />
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-500/10 text-red-300 text-sm p-3 rounded-md mt-4">
            {error}
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            className="btn-primary flex-1 text-center disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الحفظ...' : mode === 'create' ? 'حفظ الفئة' : 'تحديث الفئة'}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 text-center py-2 px-3 rounded-md border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
          ) : (
            <Link
              href="/admin/categories"
              className="flex-1 text-center py-2 px-3 rounded-md border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
            >
              رجوع لقائمة الفئات
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
