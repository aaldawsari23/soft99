/**
 * Unified Error Handling System
 * نظام موحد للتعامل مع الأخطاء
 */

/**
 * Custom Application Error Class
 * فئة مخصصة لأخطاء التطبيق
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * تحويل الخطأ إلى JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Validation Error - أخطاء التحقق من البيانات
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error - أخطاء عدم وجود البيانات
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'العنصر المطلوب غير موجود') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Authentication Error - أخطاء المصادقة
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'يجب تسجيل الدخول أولاً') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error - أخطاء الصلاحيات
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'ليس لديك صلاحية للقيام بهذا الإجراء') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Database Error - أخطاء قاعدة البيانات
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'حدث خطأ في قاعدة البيانات', details?: unknown) {
    super(message, 'DATABASE_ERROR', 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Storage Error - أخطاء التخزين
 */
export class StorageError extends AppError {
  constructor(message: string = 'حدث خطأ أثناء رفع الملف', details?: unknown) {
    super(message, 'STORAGE_ERROR', 500, details);
    this.name = 'StorageError';
  }
}

/**
 * رسائل الأخطاء الشائعة بالعربية
 */
export const ErrorMessages = {
  // Validation errors
  VALIDATION_FAILED: 'فشل التحقق من البيانات',
  REQUIRED_FIELD: 'هذا الحقل مطلوب',
  INVALID_FORMAT: 'صيغة البيانات غير صحيحة',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  INVALID_URL: 'الرابط غير صحيح',

  // Authentication errors
  INVALID_CREDENTIALS: 'بيانات الدخول غير صحيحة',
  SESSION_EXPIRED: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
  NOT_AUTHENTICATED: 'يجب تسجيل الدخول أولاً',

  // Authorization errors
  NOT_AUTHORIZED: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  ADMIN_ONLY: 'هذا الإجراء مخصص للمسؤولين فقط',

  // Database errors
  DATABASE_ERROR: 'حدث خطأ في قاعدة البيانات',
  DUPLICATE_ENTRY: 'هذا العنصر موجود مسبقاً',
  NOT_FOUND: 'العنصر المطلوب غير موجود',
  DELETE_FAILED: 'فشل الحذف',
  UPDATE_FAILED: 'فشل التحديث',
  CREATE_FAILED: 'فشل الإنشاء',

  // Storage errors
  UPLOAD_FAILED: 'فشل رفع الملف',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',

  // Generic errors
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  SERVER_ERROR: 'خطأ في الخادم',
  TIMEOUT_ERROR: 'انتهت مهلة الاتصال',
} as const;

/**
 * تحويل الخطأ إلى رسالة مناسبة للمستخدم
 */
export function getErrorMessage(error: unknown): string {
  // إذا كان الخطأ من نوع AppError
  if (error instanceof AppError) {
    return error.message;
  }

  // إذا كان الخطأ من نوع Error عادي
  if (error instanceof Error) {
    // أخطاء Firebase الشائعة
    if (error.message.includes('permission-denied')) {
      return ErrorMessages.NOT_AUTHORIZED;
    }
    if (error.message.includes('not-found')) {
      return ErrorMessages.NOT_FOUND;
    }
    if (error.message.includes('already-exists')) {
      return ErrorMessages.DUPLICATE_ENTRY;
    }
    if (error.message.includes('network')) {
      return ErrorMessages.NETWORK_ERROR;
    }

    return error.message;
  }

  // خطأ من نوع string
  if (typeof error === 'string') {
    return error;
  }

  // خطأ غير معروف
  return ErrorMessages.UNKNOWN_ERROR;
}

/**
 * تسجيل الخطأ في Console (للتطوير فقط)
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  }

  // في الإنتاج يمكن إرسال الخطأ لـ Sentry أو أي خدمة monitoring
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { tags: { context } });
  // }
}

/**
 * معالج الأخطاء العام - يستخدم في try/catch blocks
 */
export function handleError(error: unknown, context?: string): never {
  logError(error, context);

  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  throw new AppError(ErrorMessages.UNKNOWN_ERROR, 'UNKNOWN_ERROR', 500);
}

/**
 * معالج أخطاء Zod - تحويل أخطاء Zod إلى ValidationError
 */
export function handleZodError(error: unknown): ValidationError {
  // التحقق من أن الخطأ من نوع ZodError
  if (error && typeof error === 'object' && 'issues' in error) {
    const issues = (error as { issues: Array<{ path: string[]; message: string }> }).issues;

    // جمع جميع رسائل الأخطاء
    const messages = issues.map((issue) => {
      const field = issue.path.join('.');
      return field ? `${field}: ${issue.message}` : issue.message;
    });

    return new ValidationError(
      messages.join(', '),
      { issues }
    );
  }

  return new ValidationError(ErrorMessages.VALIDATION_FAILED);
}

/**
 * Async error wrapper - لف الدوال غير المتزامنة بمعالج أخطاء
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asyncErrorWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
}
