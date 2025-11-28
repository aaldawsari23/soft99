'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Brand } from '@/types';

interface BrandFormProps {
  mode: 'create' | 'edit';
  initialData?: Brand;
  onSubmit: (
    brand: Omit<Brand, 'id' | 'created_at'>
  ) => Promise<void>;
  onCancel?: () => void;
}

interface FormState {
  name: string;
  name_ar: string;
  name_en: string;
  logo_url: string;
  description: string;
}

export default function BrandForm({ mode, initialData, onSubmit, onCancel }: BrandFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<FormState>(() => ({
    name: initialData?.name ?? '',
    name_ar: initialData?.name_ar ?? '',
    name_en: initialData?.name_en ?? '',
    logo_url: initialData?.logo_url ?? '',
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
    if (!formState.name.trim()) return 'اسم العلامة التجارية مطلوب';
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

    const payload: Omit<Brand, 'id' | 'created_at'> = {
      name: formState.name,
      name_ar: formState.name_ar || undefined,
      name_en: formState.name_en || undefined,
      logo_url: formState.logo_url || undefined,
      description: formState.description || undefined,
    };

    try {
      await onSubmit(payload);
      if (mode === 'create') {
        router.push('/admin/brands');
      }
    } catch (submitError) {
      console.error('Error saving brand', submitError);
      setError('حدث خطأ أثناء حفظ العلامة التجارية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {mode === 'create' ? 'إضافة علامة تجارية جديدة' : 'تعديل العلامة التجارية'}
          </h2>
          {mode === 'edit' && initialData?.id && (
            <span className="text-xs text-text-muted">ID: {initialData.id}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* اسم العلامة التجارية (أساسي) */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-text-secondary">اسم العلامة التجارية *</label>
            <input
              className="input-field"
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="مثال: Motul"
            />
            <p className="text-xs text-text-muted">هذا الاسم يستخدم كمعرف أساسي</p>
          </div>

          {/* اسم العلامة بالعربية */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">اسم العلامة (عربي)</label>
            <input
              className="input-field"
              value={formState.name_ar}
              onChange={(e) => handleInputChange('name_ar', e.target.value)}
              placeholder="مثال: موتول"
            />
          </div>

          {/* اسم العلامة بالإنجليزية */}
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">اسم العلامة (إنجليزي)</label>
            <input
              className="input-field"
              value={formState.name_en}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              placeholder="Example: Motul"
            />
          </div>

          {/* رابط الشعار */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-text-secondary">رابط الشعار (Logo URL)</label>
            <input
              type="url"
              className="input-field"
              value={formState.logo_url}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            {formState.logo_url && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formState.logo_url}
                  alt="Brand logo preview"
                  className="h-16 w-auto object-contain rounded border border-white/10 bg-white/5 p-2"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666">شعار</text></svg>';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* الوصف */}
        <div className="space-y-1 mt-4">
          <label className="text-sm text-text-secondary">وصف العلامة التجارية</label>
          <textarea
            className="input-field min-h-[100px]"
            value={formState.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="معلومات عن العلامة التجارية..."
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
            {isSubmitting ? 'جاري الحفظ...' : mode === 'create' ? 'حفظ العلامة التجارية' : 'تحديث العلامة التجارية'}
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
              href="/admin/brands"
              className="flex-1 text-center py-2 px-3 rounded-md border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
            >
              رجوع لقائمة العلامات التجارية
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
