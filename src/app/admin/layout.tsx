'use client';

import AdminSidebar from '@/components/layout/AdminSidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminProviders } from '@/components/admin/AdminProviders';
import { useAdminAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

/**
 * Protected Admin Content
 * يتحقق من المصادقة ويوجّه للـ login إذا لزم الأمر
 */
function ProtectedAdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // إذا لم يكن في صفحة تسجيل الدخول وغير مصادق، وجّه للـ login
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }

    // إذا كان في صفحة login ومصادق بالفعل، وجّه للـ dashboard
    if (isLoginPage && !isLoading && isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isLoginPage, isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // صفحة login بدون sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // صفحات لوحة التحكم مع sidebar
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

/**
 * Admin Layout
 * يلف كل المحتوى بـ AuthProvider
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <Toaster position="top-center" />
      <ProtectedAdminContent>{children}</ProtectedAdminContent>
    </AdminProviders>
  );
}
