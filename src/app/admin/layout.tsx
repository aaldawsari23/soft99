import { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { STORE } from '@/data/config';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: `لوحة التحكم | ${STORE.name}`,
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-950 flex">
        {/* Sidebar - Desktop */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header - Mobile */}
          <AdminHeader title="لوحة التحكم" />

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
