'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'Soft99bike Store',
    storeEmail: 'info@soft99bike.com',
    storePhone: '+966 50 000 0000',
    whatsappNumber: '966500000000',
    sallaStoreUrl: 'https://salla.sa/soft99bike',
    address: 'الرياض، المملكة العربية السعودية',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الإعدادات</h1>
        <p className="text-text-secondary">إعدادات المتجر والربط</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">معلومات المتجر</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">اسم المتجر</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">رقم الجوال</label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">العنوان</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">إعدادات الربط</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">رقم الواتساب</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="input-field w-full"
                  placeholder="966500000000"
                />
                <p className="text-xs text-text-muted mt-1">الرقم بدون + أو مسافات</p>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">رابط متجر سلة</label>
                <input
                  type="url"
                  value={settings.sallaStoreUrl}
                  onChange={(e) => setSettings({ ...settings, sallaStoreUrl: e.target.value })}
                  className="input-field w-full"
                  placeholder="https://salla.sa/store-name"
                />
                <p className="text-xs text-text-muted mt-1">الرابط الأساسي لمتجرك في سلة</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              حفظ التغييرات
            </button>
            <button type="button" className="btn-secondary">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
