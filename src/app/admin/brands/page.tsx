'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/types';
import { getDataProvider } from '@/lib/data-providers';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminBrandsPage() {
  const { showToast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const provider = getDataProvider();
        const data = await provider.getBrands();
        setBrands(data);
      } catch (error) {
        showToast('حدث خطأ في تحميل الماركات', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [showToast]);

  const openForm = (brand?: Brand) => {
    setEditingBrand(brand || null);
    setFormData(brand ? { name: brand.name || '', logo: brand.logo || '' } : { name: '', logo: '' });
    setIsFormOpen(true);
  };

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
        setBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...b, ...formData } : b));
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await getDataProvider().deleteBrand(deleteId);
      setBrands(prev => prev.filter(b => b.id !== deleteId));
      showToast('تم حذف الماركة بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ في حذف الماركة', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) return <div className="p-6 animate-pulse"><div className="grid grid-cols-5 gap-4">{[...Array(10)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-32" />)}</div></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">الماركات</h1><p className="text-neutral-500 text-sm mt-1">{brands.length} ماركة</p></div>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          إضافة ماركة
        </button>
      </div>

      {brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="bg-neutral-900 rounded-2xl border border-white/5 p-4 text-center hover:border-white/10 transition-colors group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-2xl font-bold text-neutral-600">{brand.name?.charAt(0) || 'B'}</span>
                )}
              </div>
              <h3 className="text-white font-medium truncate">{brand.name}</h3>
              <div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openForm(brand)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => setDeleteId(brand.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
          <button onClick={() => openForm()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">إضافة ماركة</button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">{editingBrand ? 'تعديل الماركة' : 'إضافة ماركة جديدة'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-neutral-300 mb-2">اسم الماركة <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: Motul" className="input-field" dir="ltr" /></div>
              <div><label className="block text-sm font-medium text-neutral-300 mb-2">رابط الشعار</label><input type="url" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} placeholder="https://..." className="input-field" dir="ltr" />{formData.logo && <div className="mt-3 p-4 bg-white/5 rounded-xl"><img src={formData.logo} alt="Preview" className="max-h-20 mx-auto object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>}</div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsFormOpen(false)} className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-xl border border-white/10 hover:bg-neutral-700">إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{isSaving ? 'جاري الحفظ...' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف الماركة" message="هل أنت متأكد من حذف هذه الماركة؟" confirmText="حذف" cancelText="إلغاء" variant="danger" />
    </div>
  );
}
