/**
 * Telemetry Stub
 *
 * طبقة قياس بسيطة قابلة للاستبدال لاحقاً بخدمة حقيقية (GA/Sentry/...)
 * حالياً: تجمع الأحداث في الذاكرة وترسلها إلى console
 */

type TelemetryEvent = {
  name: string;
  payload?: Record<string, unknown>;
  timestamp: string;
};

const inMemoryEvents: TelemetryEvent[] = [];

/**
 * تسجيل حدث عام
 */
export function trackEvent(name: string, payload?: Record<string, unknown>): void {
  const event: TelemetryEvent = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  inMemoryEvents.push(event);

  if (process.env.NODE_ENV !== 'production') {
    console.info('[telemetry] event', event);
  }
}

/**
 * تسجيل عرض صفحة/شاشة
 */
export function trackView(view: string, meta?: Record<string, unknown>): void {
  trackEvent(`view:${view}`, meta);
}

/**
 * الحصول على الأحداث المسجلة (للاختبارات)
 */
export function getRecordedEvents(): TelemetryEvent[] {
  return [...inMemoryEvents];
}

/**
 * مسح الأحداث المتراكمة
 */
export function resetTelemetry(): void {
  inMemoryEvents.length = 0;
}
