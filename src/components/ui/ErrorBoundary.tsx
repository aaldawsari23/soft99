'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // يمكن إرسال الخطأ لخدمة tracking مثل Sentry
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
            // TODO: Send to error tracking service
            // Sentry.captureException(error, { extra: errorInfo });
        }
    }

    render() {
        if (this.state.hasError) {
            // استخدام fallback مخصص إذا تم توفيره
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Fallback UI افتراضي
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="card max-w-md w-full p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <div className="text-6xl">⚠️</div>
                            <h1 className="text-2xl font-bold text-white">حدث خطأ غير متوقع</h1>
                            <p className="text-text-secondary">
                                نعتذر عن هذا الإزعاج. حدث خطأ أثناء عرض هذه الصفحة.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                                <p className="text-red-400 text-sm font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="btn-primary w-full"
                            >
                                حاول مرة أخرى
                            </button>

                            <Link
                                href="/"
                                className="block w-full px-4 py-2 border border-white/10 rounded-lg text-text-secondary hover:text-white hover:border-white/20 transition-colors"
                            >
                                العودة للصفحة الرئيسية
                            </Link>
                        </div>

                        <p className="text-sm text-text-muted">
                            إذا استمرت المشكلة، يرجى الاتصال بالدعم الفني
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
