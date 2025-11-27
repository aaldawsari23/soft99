'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold">
              <span className="text-white">Soft99</span>
              <span className="text-primary">bike</span>
            </div>
          </Link>
          <p className="text-text-secondary mt-2">لوحة التحكم</p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6">تسجيل الدخول</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field w-full"
                placeholder="admin@soft99bikes.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field w-full"
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>


        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link href="/" className="text-primary hover:text-primary-hover text-sm">
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
