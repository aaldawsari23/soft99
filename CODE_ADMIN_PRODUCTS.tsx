// =============================================================================
// 📁 src/app/admin/products/page.tsx - صفحة إدارة المنتجات
// =============================================================================

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  
  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const provider = getDataProvider();
        const [productsData, categoriesData] = await Promise.all([
          provider.getProducts(),
          provider.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        showToast('حدث خطأ في تحميل البيانات', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (product.name_ar || product.name || '').toLowerCase();
        if (!name.includes(query)) return false;
      }
      
      // Category
      if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
        return false;
      }
      
      // Status
      if (selectedStatus !== 'all' && product.status !== selectedStatus) {
        return false;
      }
      
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Delete product
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const provider = getDataProvider();
      await provider.deleteProduct(deleteId);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      showToast('تم حذف المنتج بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ في حذف المنتج', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Get category name
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '-';
    return categories.find(c => c.id === categoryId)?.name_ar || '-';
  };

  if (isLoading) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">المنتجات</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {products.length} منتج
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة منتج
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث..."
            className="w-full pl-4 pr-10 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 outline-none focus:border-red-500/50"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
        >
          <option value="all">كل الفئات</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
        >
          <option value="all">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800/50">
                <tr>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">المنتج</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400 hidden md:table-cell">الفئة</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">السعر</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-400">الحالة</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-neutral-400 w-24">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">📦</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate max-w-[200px]">
                            {product.name_ar || product.name}
                          </div>
                          <div className="text-neutral-500 text-xs md:hidden">
                            {getCategoryName(product.category_id)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-sm hidden md:table-cell">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {product.price > 0 ? `${product.price} ر.س` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        product.status === 'published'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {product.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-white mb-2">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
                ? 'لا توجد نتائج'
                : 'لا توجد منتجات'
              }
            </h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'جرب تغيير معايير البحث'
                : 'ابدأ بإضافة أول منتج'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                إضافة منتج
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-32 bg-neutral-800 rounded" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-neutral-800 rounded-xl" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
        <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
      </div>
      <div className="bg-neutral-900 rounded-2xl h-96" />
    </div>
  );
}

// =============================================================================
// 📁 src/app/admin/products/new/page.tsx - إضافة منتج جديد
// =============================================================================

'use client';

import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-6">
      <ProductForm />
    </div>
  );
}

// =============================================================================
// 📁 src/app/admin/products/[id]/page.tsx - تعديل منتج
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const provider = getDataProvider();
        const data = await provider.getProductById(id as string);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return <div className="p-6 animate-pulse"><div className="h-96 bg-neutral-900 rounded-2xl" /></div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl text-white">المنتج غير موجود</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProductForm initialData={product} />
    </div>
  );
}

// =============================================================================
// 📁 src/components/admin/ProductForm.tsx - نموذج المنتج بخطوات
// =============================================================================

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

  // Form state
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Form data
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
    specifications: initialData?.specifications || {},
  });

  // Load categories & brands
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

  // Update field
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save product
  const handleSave = async (asDraft = false) => {
    // Validation
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
        status: asDraft ? 'draft' : 'published',
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
      showToast('حدث خطأ في حفظ المنتج', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Steps config
  const steps = [
    { id: 'basic', label: 'الأساسيات', icon: '1' },
    { id: 'details', label: 'التفاصيل', icon: '2' },
    { id: 'images', label: 'الصور', icon: '3' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
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
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
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

      {/* Steps Navigation */}
      <div className="bg-neutral-900 rounded-2xl border border-white/5 p-2">
        <div className="flex">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as FormStep)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                currentStep === step.id
                  ? 'bg-red-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                currentStep === step.id ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {step.icon}
              </span>
              <span className="font-medium hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
        {/* Step 1: Basic Info */}
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
                <select
                  value={formData.category_id}
                  onChange={(e) => updateField('category_id', e.target.value)}
                  className="input-field"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="الماركة">
                <select
                  value={formData.brand_id}
                  onChange={(e) => updateField('brand_id', e.target.value)}
                  className="input-field"
                >
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
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-field pl-12"
                    min="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">ر.س</span>
                </div>
              </FormField>

              <FormField label="الكمية">
                <input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => updateField('stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="input-field"
                  min="0"
                />
              </FormField>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep('details')}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 'details' && (
          <div className="space-y-5">
            <FormField label="وصف مختصر">
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => updateField('short_description', e.target.value)}
                placeholder="وصف قصير يظهر في كارت المنتج"
                className="input-field"
                maxLength={100}
              />
              <p className="text-neutral-500 text-xs mt-1">
                {formData.short_description.length}/100 حرف
              </p>
            </FormField>

            <FormField label="الوصف الكامل">
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="وصف تفصيلي للمنتج..."
                rows={5}
                className="input-field resize-none"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="رمز المنتج (SKU)">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => updateField('sku', e.target.value)}
                  placeholder="MOT-7100-1L"
                  className="input-field"
                  dir="ltr"
                />
              </FormField>

              <FormField label="سعر التكلفة">
                <div className="relative">
                  <input
                    type="number"
                    value={formData.cost_price || ''}
                    onChange={(e) => updateField('cost_price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="input-field pl-12"
                    min="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">ر.س</span>
                </div>
              </FormField>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep('basic')}
                className="px-6 py-2.5 text-neutral-400 hover:text-white transition-colors"
              >
                → السابق
              </button>
              <button
                onClick={() => setCurrentStep('images')}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Images */}
        {currentStep === 'images' && (
          <div className="space-y-5">
            <ImageUploader
              images={formData.images}
              onChange={(images) => updateField('images', images)}
              productId={initialData?.id}
            />

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep('details')}
                className="px-6 py-2.5 text-neutral-400 hover:text-white transition-colors"
              >
                → السابق
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'نشر المنتج'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component
function FormField({ 
  label, 
  required, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode;
}) {
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

// =============================================================================
// 📁 src/components/admin/ImageUploader.tsx - رافع الصور
// =============================================================================

'use client';

import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useToast } from '@/contexts/ToastContext';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
}

export default function ImageUploader({ images, onChange, productId }: ImageUploaderProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} ليس صورة صالحة`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} أكبر من 5MB`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
        const path = `products/${productId || 'new'}/${fileName}`;
        const storageRef = ref(storage, path);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
        
        setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      onChange([...images, ...uploadedUrls]);
      showToast(`تم رفع ${uploadedUrls.length} صورة بنجاح`, 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('حدث خطأ في رفع الصور', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Try to delete from storage
      if (imageUrl.includes('firebase')) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef).catch(() => {});
      }
    } catch (error) {
      // Ignore delete errors
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        صور المنتج
      </label>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isUploading 
            ? 'border-red-500/50 bg-red-500/5' 
            : 'border-white/10 hover:border-red-500/50 hover:bg-white/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-neutral-700 border-t-red-500 animate-spin" />
            <p className="text-white font-medium">جاري الرفع... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white font-medium">اضغط لرفع الصور</p>
            <p className="text-neutral-500 text-sm mt-1">أو اسحب وأفلت الصور هنا</p>
            <p className="text-neutral-600 text-xs mt-2">PNG, JPG, WebP - حد أقصى 5MB</p>
          </>
        )}
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative group aspect-square">
              <img
                src={url}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    onClick={() => handleReorder(index, index - 1)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30"
                  >
                    →
                  </button>
                )}
                
                {/* Delete */}
                <button
                  onClick={() => handleRemove(index)}
                  className="w-8 h-8 bg-red-500/80 rounded-lg flex items-center justify-center text-white hover:bg-red-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    onClick={() => handleReorder(index, index + 1)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30"
                  >
                    ←
                  </button>
                )}
              </div>

              {/* Main Badge */}
              {index === 0 && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded-lg">
                  رئيسية
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-neutral-500 text-xs">
        الصورة الأولى ستكون الصورة الرئيسية للمنتج. اسحب لتغيير الترتيب.
      </p>
    </div>
  );
}

// =============================================================================
// 📁 src/components/ui/ConfirmDialog.tsx - مربع تأكيد
// =============================================================================

'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  confirmVariant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-neutral-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors ${
              confirmVariant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isLoading ? 'جاري...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
