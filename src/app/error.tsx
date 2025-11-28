'use client';


export default function GlobalErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/5 max-w-md w-full p-8 text-center space-y-6">
                <div className="space-y-2">
                    <div className="text-6xl">⚠️</div>
                    <h1 className="text-2xl font-bold text-white">حدث خطأ في التطبيق</h1>
                    <p className="text-neutral-400">
                        نعتذر عن هذا الإزعاج. حدث خطأ غير متوقع.
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                        <p className="text-red-400 text-sm font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <button
                    onClick={() => reset()}
                    className="btn-primary w-full"
                >
                    حاول مرة أخرى
                </button>
            </div>
        </div>
    );
}
