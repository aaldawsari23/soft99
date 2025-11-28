'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  initialData?: Product;
}

type FormStep = 'basic' | 'details' | 'images';

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEditing = !!initialData;

  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [formData, setFormData] = useState({
    name_ar: initialData?.name_ar || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    short_description: initialData?.short_description || '',
    price: initialData?.price || 0,
    cost_price: initialData?.cost_price || 0,
    stock: initialData?.stock ?? 0,
    category_id: initialData?.category_id || '',
    brand_id: initialData?.brand_id || '',
    sku: initialData?.sku || '',
    status: initialData?.status || 'draft',
    images: initialData?.images || [],
  });

  useEffect(() => {
    async function load() {
      try {
        const provider = getDataProvider();
        const [cats, brds] = await Promise.all([
          provider.getCategories(),
          provider.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brds);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    }
    load();
  }, []);

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (asDraft = false) => {
    if (!formData.name_ar.trim()) {
      showToast('يرجى إدخال اسم المنتج', 'error');
      setCurrentStep('basic');
      return;
    }
    if (!formData.category_id) {
      showToast('يرجى اختيار الفئة', 'error');
      setCurrentStep('basic');
      return;
    }

    setIsSaving(true);
    try {
      const provider = getDataProvider();
      const dataToSave = {
        ...formData,
        status: asDraft ? 'draft' as const : 'published' as const,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && initialData) {
        await provider.updateProduct(initialData.id, dataToSave);
        showToast('تم تحديث المنتج بنجاح', 'success');
      } else {
        await provider.createProduct({
          ...dataToSave,
          created_at: new Date().toISOString(),
        } as Product);
        showToast('تم إضافة المنتج بنجاح', 'success');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('حدث خطأ في حفظ المنتج', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { id: 'basic', label: 'الأساسيات', icon: '1' },
    { id: 'details', label: 'التفاصيل', icon: '2' },
    { id: 'images', label: 'الصور', icon: '3' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {isEditing ? 'قم بتعديل بيانات المنتج' : 'أدخل بيانات المنتج الجديد'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">
            إلغاء
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            حفظ كمسودة
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'جاري الحفظ...' : 'نشر'}
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-2xl border border-white/5 p-2">
        <div className="flex">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as FormStep)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${currentStep === step.id ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${currentStep === step.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                {step.icon}
              </span>
              <span className="font-medium hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
        {currentStep === 'basic' && (
          <div className="space-y-5">
            <FormField label="اسم المنتج" required>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => updateField('name_ar', e.target.value)}
                placeholder="مثال: زيت موتول 7100"
                className="input-field"
              />
            </FormField>

            <FormField label="اسم المنتج بالإنجليزية">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Motul 7100"
                className="input-field"
                dir="ltr"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="الفئة" required>
                <select value={formData.category_id} onChange={(e) => updateField('category_id', e.target.value)} className="input-field">
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="الماركة">
                <select value={formData.brand_id} onChange={(e) => updateField('brand_id', e.target.value)} className="input-field">
                  <option value="">اختر الماركة</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="السعر" required>
                <div className="relative">
                  <input type="number" value={formData.price || ''} onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)} placeholder="0" className="input-field pl-12" min="0" />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">ر.س</span>
                </div>
              </FormField>

              <FormField label="الكمية">
                <input type="number" value={formData.stock || ''} onChange={(e) => updateField('stock', parseInt(e.target.value) || 0)} placeholder="0" className="input-field" min="0" />
              </FormField>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setCurrentStep('details')} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                التالي ←
              </button>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="space-y-5">
            <FormField label="وصف مختصر">
              <input type="text" value={formData.short_description} onChange={(e) => updateField('short_description', e.target.value)} placeholder="وصف قصير يظهر في كارت المنتج" className="input-field" maxLength={100} />
              <p className="text-neutral-500 text-xs mt-1">{formData.short_description.length}/100 حرف</p>
            </FormField>

            <FormField label="الوصف الكامل">
              <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="وصف تفصيلي للمنتج..." rows={5} className="input-field resize-none" />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="رمز المنتج (SKU)">
                <input type="text" value={formData.sku} onChange={(e) => updateField('sku', e.target.value)} placeholder="MOT-7100-1L" className="input-field" dir="ltr" />
              </FormField>

              <FormField label="سعر التكلفة">
                <div className="relative">
                  <input type="number" value={formData.cost_price || ''} onChange={(e) => updateField('cost_price', parseFloat(e.target.value) || 0)} placeholder="0" className="input-field pl-12" min="0" />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">ر.س</span>
                </div>
              </FormField>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentStep('basic')} className="px-6 py-2.5 text-neutral-400 hover:text-white transition-colors">→ السابق</button>
              <button onClick={() => setCurrentStep('images')} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">التالي ←</button>
            </div>
          </div>
        )}

        {currentStep === 'images' && (
          <div className="space-y-5">
            <ImageUploader
              images={formData.images}
              onChange={(newImages) => updateField('images', newImages)}
              productId={initialData?.id}
            />


            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentStep('details')} className="px-6 py-2.5 text-neutral-400 hover:text-white transition-colors">→ السابق</button>
              <button onClick={() => handleSave(false)} disabled={isSaving} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
                {isSaving ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'نشر المنتج'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}
