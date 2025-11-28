'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAdminAuth();

  const menuItems = [
    {
      name: 'لوحة التحكم',
      href: '/admin/dashboard',
      icon: '📊',
    },
    {
      name: 'المنتجات',
      href: '/admin/products',
      icon: '📦',
    },
    {
      name: 'الفئات',
      href: '/admin/categories',
      icon: '📁',
    },
    {
      name: 'الماركات',
      href: '/admin/brands',
      icon: '🏷️',
    },
    {
      name: 'الإعدادات',
      href: '/admin/settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="w-64 bg-background-light border-l border-gray-800 min-h-screen sticky top-0">
      <div className="p-6">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-8">
          <div className="text-xl font-bold">
            <span className="text-white">Soft99</span>
            <span className="text-primary">bike</span>
          </div>
        </Link>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          {user && (
            <div className="mb-4 px-3 py-2 bg-background rounded-lg">
              <p className="text-xs text-text-muted">مرحباً،</p>
              <p className="text-sm text-white font-semibold truncate">{user.name || user.email}</p>
            </div>
          )}

          <Link href="/" className="sidebar-link text-primary hover:bg-primary/10">
            <span className="text-xl">🏠</span>
            <span>العودة للمتجر</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="sidebar-link w-full text-right text-red-400 hover:bg-red-500/10"
          >
            <span className="text-xl">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
