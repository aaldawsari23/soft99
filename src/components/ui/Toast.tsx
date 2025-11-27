'use client';

import { useToast, Toast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-auto md:bottom-6 md:top-auto md:left-1/2 md:-translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Start exit animation before removal
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, 2700);

    return () => clearTimeout(exitTimer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400';
      case 'error':
        return 'bg-red-500/90 text-white border-red-400';
      case 'warning':
        return 'bg-yellow-500/90 text-white border-yellow-400';
      case 'info':
        return 'bg-blue-500/90 text-white border-blue-400';
      default:
        return 'bg-green-500/90 text-white border-green-400';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        backdrop-blur-md border-2 rounded-xl px-6 py-4 shadow-2xl
        flex items-center gap-3 min-w-[280px] max-w-[90vw] md:max-w-md
        pointer-events-auto transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="alert"
    >
      <div className="text-2xl flex-shrink-0">{getIcon()}</div>
      <p className="text-sm md:text-base font-semibold flex-1 text-right leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity text-lg"
        aria-label="إغلاق"
      >
        ✕
      </button>
    </div>
  );
}
