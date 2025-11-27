/**
 * Data Providers Entry Point
 *
 * نقطة الدخول الرئيسية لمزودي البيانات
 * يمكن التبديل بين المزود المحلي ومزود API من هنا
 */

import { DataProvider, ProviderConfig } from './types';
import { localProvider } from './localProvider';
import { apiProvider } from './apiProvider.stub';
import { firestoreProvider } from './firestoreProvider';

/**
 * المزود النشط حالياً
 * TODO: عند ربط الباك-إند، استبدل بـ API provider
 */
const providerSource = (process.env.DATA_PROVIDER || process.env.NEXT_PUBLIC_DATA_PROVIDER || 'firestore').toLowerCase();

// حدد المزود النشط بناءً على متغيرات البيئة مع ضمان السقوط للمحلي
let activeProvider: DataProvider = (() => {
  try {
    let source: 'local' | 'api' | 'firestore' = 'local';
    if (providerSource === 'api') source = 'api';
    else if (providerSource === 'firestore') source = 'firestore';

    return createProvider({ source });
  } catch (error) {
    console.warn('[data-provider] Falling back to local provider:', error);
    return localProvider;
  }
})();

/**
 * الحصول على المزود النشط
 */
export function getDataProvider(): DataProvider {
  return activeProvider;
}

/**
 * تعيين المزود النشط
 * يستخدم للتبديل بين المزود المحلي ومزود API
 */
export function setDataProvider(provider: DataProvider): void {
  activeProvider = provider;
}

/**
 * إنشاء مزود بناءً على الإعدادات
 * TODO: إضافة API provider عند التفعيل
 */
export function createProvider(config: ProviderConfig): DataProvider {
  switch (config.source) {
    case 'local':
      return localProvider;

    case 'api':
      // يسمح بتفعيل مزود API في المستقبل دون كسر الواجهة الحالية
      return apiProvider;

    case 'firestore':
      return firestoreProvider;

    default:
      throw new Error(`Unknown provider source: ${config.source}`);
  }
}

// تصدير المزود المحلي كخيار افتراضي
export { localProvider } from './localProvider';
export { apiProvider } from './apiProvider.stub';
export * from './types';

// تصدير المزود النشط كـ default
export default getDataProvider;
