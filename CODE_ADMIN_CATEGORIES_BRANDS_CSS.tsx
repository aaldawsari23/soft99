// =============================================================================
// 📁 src/app/admin/categories/page.tsx - إدارة الفئات
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name_ar: '', name: '', icon: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const provider = getDataProvider();
      const data = await provider.getCategories();
      setCategories(data);
    } catch (error) {
      showToast('حدث خطأ في تحميل الفئات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open form for new/edit
  const openForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name_ar: category.name_ar || '',
        name: category.name || '',
        icon: category.icon || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name_ar: '', name: '', icon: '' });
    }
    setIsFormOpen(true);
  };

  // Save category
  const handleSave = async () => {
    if (!formData.name_ar.trim()) {
      showToast('يرجى إدخال اسم الفئة', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const provider = getDataProvider();
      
      if (editingCategory) {
        await provider.updateCategory(editingCategory.id, formData);
        setCategories(prev => prev.map(c => 
          c.id === editingCategory.id ? { ...c, ...formData } : c
        ));
        showToast('تم تحديث الفئة بنجاح', 'success');
      } else {
        const newCategory = await provider.createCategory({
          ...formData,
          order: categories.length,
        } as Category);
        setCategories(prev => [...prev, newCategory]);
        showToast('تم إضافة الفئة بنجاح', 'success');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      showToast('حدث خطأ في حفظ الفئة', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const provider = getDataProvider();
      await provider.deleteCategory(deleteId);
      setCategories(prev => prev.filter(c => c.id !== deleteId));
      showToast('تم حذف الفئة بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ في حذف الفئة', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Common icons
  const commonIcons = ['🛢️', '🔧', '⚙️', '🏍️', '🔩', '💡', '🛡️', '🎨', '📦', '⭐'];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">الفئات</h1>
          <p className="text-neutral-500 text-sm mt-1">{categories.length} فئة</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة فئة
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-neutral-900 rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {category.icon || '📁'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{category.name_ar}</h3>
                    {category.name && (
                      <p className="text-neutral-500 text-sm">{category.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openForm(category)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState onAdd={() => openForm()} />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  اسم الفئة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="مثال: زيوت"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  الاسم بالإنجليزية
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Oils"
                  className="input-field"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  الأيقونة
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                        formData.icon === icon
                          ? 'bg-red-600 ring-2 ring-red-500'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="أو اكتب emoji"
                  className="input-field text-center text-xl"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف الفئة"
        message="هل أنت متأكد من حذف هذه الفئة؟ سيتم إزالة الفئة من جميع المنتجات المرتبطة."
        confirmText="حذف"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-white/5 p-12 text-center">
      <div className="text-5xl mb-4">📁</div>
      <h3 className="text-lg font-bold text-white mb-2">لا توجد فئات</h3>
      <p className="text-neutral-500 mb-6">ابدأ بإضافة فئات لتنظيم منتجاتك</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
      >
        إضافة فئة
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-24 bg-neutral-800 rounded" />
        <div className="h-10 w-28 bg-neutral-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl h-24" />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// 📁 src/app/admin/brands/page.tsx - إدارة الماركات
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminBrandsPage() {
  const { showToast } = useToast();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load brands
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const provider = getDataProvider();
      const data = await provider.getBrands();
      setBrands(data);
    } catch (error) {
      showToast('حدث خطأ في تحميل الماركات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open form
  const openForm = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name || '', logo: brand.logo || '' });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', logo: '' });
    }
    setIsFormOpen(true);
  };

  // Save
  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم الماركة', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const provider = getDataProvider();
      
      if (editingBrand) {
        await provider.updateBrand(editingBrand.id, formData);
        setBrands(prev => prev.map(b => 
          b.id === editingBrand.id ? { ...b, ...formData } : b
        ));
        showToast('تم تحديث الماركة بنجاح', 'success');
      } else {
        const newBrand = await provider.createBrand(formData as Brand);
        setBrands(prev => [...prev, newBrand]);
        showToast('تم إضافة الماركة بنجاح', 'success');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      showToast('حدث خطأ في حفظ الماركة', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const provider = getDataProvider();
      await provider.deleteBrand(deleteId);
      setBrands(prev => prev.filter(b => b.id !== deleteId));
      showToast('تم حذف الماركة بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ في حذف الماركة', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">الماركات</h1>
          <p className="text-neutral-500 text-sm mt-1">{brands.length} ماركة</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة ماركة
        </button>
      </div>

      {/* Brands Grid */}
      {brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {brands.map(brand => (
            <div
              key={brand.id}
              className="bg-neutral-900 rounded-2xl border border-white/5 p-4 text-center hover:border-white/10 transition-colors group"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-2xl font-bold text-neutral-600">
                    {brand.name?.charAt(0) || 'B'}
                  </span>
                )}
              </div>
              <h3 className="text-white font-medium truncate">{brand.name}</h3>
              
              <div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openForm(brand)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(brand.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-2xl border border-white/5 p-12 text-center">
          <div className="text-5xl mb-4">🏷️</div>
          <h3 className="text-lg font-bold text-white mb-2">لا توجد ماركات</h3>
          <p className="text-neutral-500 mb-6">أضف الماركات التي تبيع منتجاتها</p>
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            إضافة ماركة
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingBrand ? 'تعديل الماركة' : 'إضافة ماركة جديدة'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  اسم الماركة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: Motul"
                  className="input-field"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  رابط الشعار
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://..."
                  className="input-field"
                  dir="ltr"
                />
                {formData.logo && (
                  <div className="mt-3 p-4 bg-white/5 rounded-xl">
                    <img 
                      src={formData.logo} 
                      alt="Preview" 
                      className="max-h-20 mx-auto object-contain"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف الماركة"
        message="هل أنت متأكد من حذف هذه الماركة؟"
        confirmText="حذف"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-24 bg-neutral-800 rounded" />
        <div className="h-10 w-28 bg-neutral-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl h-32" />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// 📁 src/app/globals.css - الستايلات الجديدة (استبدال كامل)
// =============================================================================

/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

@layer base {
  * {
    @apply border-white/10;
  }
  
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-neutral-950 text-white antialiased;
    font-family: 'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-white/20;
  }

  /* Selection */
  ::selection {
    @apply bg-red-500/30;
  }
}

@layer components {
  /* Buttons */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3 
           bg-red-600 text-white font-medium rounded-xl
           hover:bg-red-700 active:scale-[0.98] 
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all duration-200;
  }
  
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3 
           bg-neutral-800 text-white font-medium rounded-xl
           border border-white/10
           hover:bg-neutral-700 active:scale-[0.98] 
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all duration-200;
  }
  
  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2 px-4 py-2 
           text-neutral-400 font-medium rounded-xl
           hover:text-white hover:bg-white/5
           transition-all duration-200;
  }
  
  /* Input Fields */
  .input-field {
    @apply w-full bg-neutral-900 border border-white/10 rounded-xl 
           px-4 py-3 text-white placeholder-neutral-500
           outline-none transition-all duration-200
           focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20;
  }
  
  .input-field:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  
  /* Cards */
  .card {
    @apply bg-neutral-900 border border-white/5 rounded-2xl;
  }
  
  .card-hover {
    @apply card hover:border-white/10 transition-colors;
  }

  /* Badges */
  .badge {
    @apply inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full;
  }
  
  .badge-success {
    @apply badge bg-green-500/10 text-green-500;
  }
  
  .badge-warning {
    @apply badge bg-yellow-500/10 text-yellow-500;
  }
  
  .badge-error {
    @apply badge bg-red-500/10 text-red-500;
  }

  /* Animations */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0; 
      transform: scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
}

@layer utilities {
  /* RTL Support */
  .flip-x {
    transform: scaleX(-1);
  }
  
  /* Line Clamp */
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
*/
