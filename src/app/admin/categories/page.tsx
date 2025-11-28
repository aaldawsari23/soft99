'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name_ar: '', name: '', icon: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const provider = getDataProvider();
        const data = await provider.getCategories();
        setCategories(data);
      } catch (error) {
        showToast('حدث خطأ في تحميل الفئات', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [showToast]);

  const openForm = (category?: Category) => {
    setEditingCategory(category || null);
    setFormData(category ? { name_ar: category.name_ar || '', name: category.name || '', icon: category.icon || '' } : { name_ar: '', name: '', icon: '' });
    setIsFormOpen(true);
  };

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
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
        showToast('تم تحديث الفئة بنجاح', 'success');
      } else {
        const newCategory = await provider.createCategory({
          ...formData,
          order: categories.length,
          type: 'part' // Default type
        } as unknown as Omit<Category, 'id' | 'created_at'>);
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await getDataProvider().deleteCategory(deleteId);
      setCategories(prev => prev.filter(c => c.id !== deleteId));
      showToast('تم حذف الفئة بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ في حذف الفئة', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const commonIcons = ['🛢️', '🔧', '⚙️', '🏍️', '🔩', '💡', '🛡️', '🎨', '📦', '⭐'];

  if (isLoading) return <div className="p-6 animate-pulse"><div className="h-8 w-24 bg-neutral-800 rounded mb-4" /><div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-24" />)}</div></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">الفئات</h1><p className="text-neutral-500 text-sm mt-1">{categories.length} فئة</p></div>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          إضافة فئة
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="bg-neutral-900 rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">{category.icon || '📁'}</div>
                  <div><h3 className="text-white font-bold">{category.name_ar}</h3>{category.name && <p className="text-neutral-500 text-sm">{category.name}</p>}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openForm(category)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => setDeleteId(category.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-2xl border border-white/5 p-12 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-lg font-bold text-white mb-2">لا توجد فئات</h3>
          <p className="text-neutral-500 mb-6">ابدأ بإضافة فئات لتنظيم منتجاتك</p>
          <button onClick={() => openForm()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">إضافة فئة</button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">{editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-neutral-300 mb-2">اسم الفئة <span className="text-red-500">*</span></label><input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} placeholder="مثال: زيوت" className="input-field" /></div>
              <div><label className="block text-sm font-medium text-neutral-300 mb-2">الاسم بالإنجليزية</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Oils" className="input-field" dir="ltr" /></div>
              <div><label className="block text-sm font-medium text-neutral-300 mb-2">الأيقونة</label><div className="flex flex-wrap gap-2 mb-3">{commonIcons.map(icon => (<button key={icon} type="button" onClick={() => setFormData({ ...formData, icon })} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${formData.icon === icon ? 'bg-red-600 ring-2 ring-red-500' : 'bg-white/5 hover:bg-white/10'}`}>{icon}</button>))}</div><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="أو اكتب emoji" className="input-field text-center text-xl" dir="ltr" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsFormOpen(false)} className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700 transition-colors">إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">{isSaving ? 'جاري الحفظ...' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف الفئة" message="هل أنت متأكد من حذف هذه الفئة؟" confirmText="حذف" cancelText="إلغاء" variant="danger" />
    </div>
  );
}
