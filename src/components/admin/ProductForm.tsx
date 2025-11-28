'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { getDataProvider } from '@/lib/data-providers';
import { uploadImage } from '@/lib/storage';
import { Brand, Category, Product, ProductStatus, ProductType } from '@/types';
import { Tabs } from '@/components/ui/Tabs';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: Product;
  onSubmit: (
    product: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<void>;
  onCancel?: () => void;
}

interface FormState {
  name_ar: string;
  name_en: string;
  sku: string;
  category_id: string;
  brand_id: string;
  type: ProductType;
  price: number;
  currency: string;
  description: string;
  short_description: string;
  status: ProductStatus;
  is_featured: boolean;
  stock_quantity: number;
  images: string[];
}

function normalizeInitialImages(product?: Product): string[] {
  if (!product) return [];
  if (product.images && product.images.length > 0) return product.images;
  if (product.image_url) return [product.image_url];
  return [];
}

export default function ProductForm({ mode, initialData, onSubmit, onCancel }: ProductFormProps) {
  const router = useRouter();
  const dataProvider = useMemo(() => getDataProvider(), []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const [formState, setFormState] = useState<FormState>(() => ({
    name_ar: initialData?.name_ar ?? '',
    name_en: initialData?.name_en ?? '',
    sku: initialData?.sku ?? '',
    category_id: initialData?.category_id ?? '',
    brand_id: initialData?.brand_id ?? '',
    type: initialData?.type ?? 'part',
    price: initialData?.price ?? 0,
    currency: initialData?.currency ?? 'SAR',
    description: initialData?.description ?? '',
    short_description: initialData?.short_description ?? '',
    status: initialData?.status ?? 'published',
    is_featured: initialData?.is_featured ?? false,
    stock_quantity: initialData?.stock_quantity ?? 0,
    images: normalizeInitialImages(initialData),
  }));

  // Load categories & brands for dropdowns
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, brs] = await Promise.all([
          dataProvider.getCategories(),
          dataProvider.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (metaError) {
        console.error('Error loading meta data', metaError);
        setError('حدث خطأ أثناء تحميل البيانات المساندة');
      } finally {
        setIsLoadingMeta(false);
      }
    }
    loadMeta();
  }, [dataProvider]);

  const handleInputChange = (
    field: keyof FormState,
    value: string | number | boolean
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUrlAdd = (value: string) => {
    if (!value) return;
    setFormState(prev => ({
      ...prev,
      images: [...prev.images, value],
    }));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    try {
      setIsUploading(true);
      const path = `products/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);

      setFormState(prev => ({
        ...prev,
        images: [...prev.images, url],
      }));
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('فشل رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const validate = (): string | null => {
    if (!formState.name_ar.trim()) return 'اسم المنتج (بالعربية) مطلوب';
    if (!formState.category_id) return 'يجب اختيار الفئة';
    if (!formState.price || formState.price < 0) return 'السعر يجب أن يكون رقمًا أكبر من 0';
    if (!formState.currency) return 'العملة مطلوبة';
    if (!formState.description.trim()) return 'الوصف مطلوب';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const payload: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
      name: formState.name_ar, // compatibility
      name_ar: formState.name_ar,
      name_en: formState.name_en || undefined,
      sku: formState.sku || undefined,
      category_id: formState.category_id,
      brand_id: formState.brand_id || undefined,
      type: formState.type,
      price: Number(formState.price),
      currency: formState.currency,
      description: formState.description,
      short_description: formState.short_description || undefined,
      status: formState.status,
      is_featured: formState.is_featured,
      stock_quantity: formState.stock_quantity ? Number(formState.stock_quantity) : undefined,
      stock_status: formState.stock_quantity && formState.stock_quantity > 0 ? 'available' : 'unavailable',
      images: formState.images,
      image_url: formState.images[0],
      specs: initialData?.specs,
      specifications: initialData?.specifications,
      salla_url: initialData?.salla_url,
      is_available: formState.stock_quantity > 0,
      is_new: initialData?.is_new,
      remoteImageUrl: initialData?.remoteImageUrl,
    };

    try {
      await onSubmit(payload);
      toast.success(mode === 'create' ? 'تم إضافة المنتج بنجاح' : 'تم تحديث المنتج بنجاح');
      if (mode === 'create') {
        router.push('/admin/products');
      }
    } catch (submitError) {
      console.error('Error saving product', submitError);
      toast.error('حدث خطأ أثناء حفظ المنتج');
      setError('حدث خطأ أثناء حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'البيانات الأساسية', icon: '📝' },
    { id: 'details', label: 'التفاصيل والوصف', icon: '📄' },
    { id: 'organization', label: 'التصنيف والتنظيم', icon: '🏷️' },
    { id: 'media', label: 'الصور والوسائط', icon: '🖼️' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          {mode === 'create' ? 'إضافة منتج جديد' : 'تعديل المنتج'}
        </h2>
        <div className="flex gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
          ) : (
            <Link href="/admin/products" className="btn-secondary">
              إلغاء
            </Link>
          )}
          <button
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="bg-background-light/50" />

        <div className="p-6">
          {/* Basic Info Tab */}
          <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">اسم المنتج (عربي) *</label>
                <input
                  className="input-field w-full"
                  value={formState.name_ar}
                  onChange={(e) => handleInputChange('name_ar', e.target.value)}
                  placeholder="مثال: خوذة رياضية احترافية"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">اسم المنتج (إنجليزي)</label>
                <input
                  className="input-field w-full"
                  value={formState.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="e.g. Professional Sport Helmet"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">السعر *</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input-field w-full pl-16"
                    value={formState.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    min={0}
                    step="0.01"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-bold">
                    {formState.currency}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">الكمية المتوفرة</label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={formState.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">رقم المنتج (SKU)</label>
                <input
                  className="input-field w-full"
                  value={formState.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="SKU-12345"
                />
              </div>
            </div>
          </div>

          {/* Details Tab */}
          <div className={activeTab === 'details' ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">وصف مختصر</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  value={formState.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="وصف سريع يظهر في القوائم..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">الوصف الكامل *</label>
                <textarea
                  className="input-field w-full min-h-[200px]"
                  value={formState.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="تفاصيل المنتج الكاملة..."
                />
              </div>
            </div>
          </div>

          {/* Organization Tab */}
          <div className={activeTab === 'organization' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">الفئة *</label>
                <select
                  className="input-field w-full"
                  value={formState.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  disabled={isLoadingMeta}
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">الماركة</label>
                <select
                  className="input-field w-full"
                  value={formState.brand_id}
                  onChange={(e) => handleInputChange('brand_id', e.target.value)}
                  disabled={isLoadingMeta}
                >
                  <option value="">بدون ماركة</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name_ar || brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">نوع المنتج</label>
                <select
                  className="input-field w-full"
                  value={formState.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ProductType)}
                >
                  <option value="bike">دراجة نارية</option>
                  <option value="part">قطعة غيار</option>
                  <option value="gear">معدات وإكسسوارات</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">حالة النشر</label>
                <select
                  className="input-field w-full"
                  value={formState.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ProductStatus)}
                >
                  <option value="published">منشور (ظاهر للعملاء)</option>
                  <option value="hidden">مخفي (مسودة)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-primary"
                    checked={formState.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  />
                  <div>
                    <span className="block font-medium text-white">منتج مميز</span>
                    <span className="text-sm text-text-secondary">سيظهر هذا المنتج في الصفحة الرئيسية وفي قسم المنتجات المميزة</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Media Tab */}
          <div className={activeTab === 'media' ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border-light rounded-2xl p-8 text-center hover:border-primary/50 transition-colors bg-background-light/30">
                <div className="mb-4 text-4xl">☁️</div>
                <h3 className="text-lg font-medium text-white mb-2">رفع صور المنتج</h3>
                <p className="text-text-secondary mb-6 text-sm">قم بسحب وإفلات الصور هنا أو اضغط للاختيار</p>

                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`btn-primary inline-block cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'جاري الرفع...' : 'اختيار صورة'}
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">أو أضف رابط خارجي</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="input-field flex-1"
                    placeholder="https://example.com/image.jpg"
                    onBlur={(e) => handleImageUrlAdd(e.target.value.trim())}
                  />
                </div>
              </div>

              {formState.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formState.images.map((img, index) => (
                    <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-background-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="حذف الصورة"
                        >
                          🗑️
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md shadow-lg">
                          الرئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
