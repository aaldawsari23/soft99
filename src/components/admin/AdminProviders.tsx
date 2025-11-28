/**
 * Admin Layout Wrapper
 *
 * يلف جميع صفحات لوحة التحكم بـ AuthProvider
 */

'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
