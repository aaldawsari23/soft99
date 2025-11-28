/**
 * Admin Authentication Context
 *
 * Context لإدارة حالة المصادقة في لوحة التحكم
 * حالياً: يستخدم localStorage (مؤقت)
 * مستقبلاً: سيتم الربط بـ Supabase Auth أو NextAuth
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// المستخدم الافتراضي للتطوير
// TODO: استبدل بـ Auth حقيقي من Supabase
const DEMO_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@soft99bikes.com',
  name: 'مدير المتجر',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// بيانات تسجيل الدخول المؤقتة
// TODO: استبدل بـ Auth حقيقي
const DEMO_CREDENTIALS = {
  email: 'admin@soft99bikes.com',
  password: 'admin123', // في الإنتاج، لا تخزن كلمات المرور في الكود!
};

const AUTH_STORAGE_KEY = 'soft99_admin_auth';
const AUTH_COOKIE_KEY = 'soft99_admin_token';

function setAuthCookie(value: string, maxAgeDays: number = 7) {
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_KEY}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
}

function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const cookieString = document.cookie || '';
  const cookies = cookieString.split(';').map((c) => c.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith(`${AUTH_COOKIE_KEY}=`));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to our User type
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Admin',
          role: 'admin', // For now, assume all authenticated users are admins
          created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook للوصول لحالة المصادقة
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook للتحقق من صلاحيات الأدمن
 */
export function useAdminAuth() {
  const auth = useAuth();

  const isAdmin = auth.isAuthenticated && auth.user?.role === 'admin';

  return {
    ...auth,
    isAdmin,
  };
}
