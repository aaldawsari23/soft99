'use client';

import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { LazyProductImage } from '@/components/ui/LazyProductImage';
import { WHATSAPP_NUMBER } from '@/data/config';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = 'مرحباً، أود طلب المنتجات التالية:\n\n';

    items.forEach(item => {
      const name = item.product.name_ar || item.product.name || 'منتج';
      const sku = item.product.sku || item.product.id;
      message += `• ${name}\n`;
      message += `  SKU: ${sku}\n`;
      message += `  الكمية: ${item.quantity}\n`;
      if (item.product.price > 0) {
        message += `  السعر: ${item.product.price} ${item.product.currency}\n`;
      }
      message += '\n';
    });

    const total = getTotalPrice();
    if (total > 0) {
      message += `\nالإجمالي: ${total.toLocaleString('ar-SA')} ريال`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background-card border-l border-border shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">سلة التسوق</h2>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-white p-2"
                aria-label="إغلاق"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 opacity-50">🛒</div>
                <p className="text-text-secondary">السلة فارغة</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.product.id} className="bg-background rounded-lg p-3 border border-border">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-background flex-shrink-0">
                      <LazyProductImage product={item.product} alt={item.product.name_ar || ''} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-2">
                        {item.product.name_ar || item.product.name || 'منتج'}
                      </h3>
                      <p className="text-xs text-text-muted">SKU: {item.product.sku || item.product.id}</p>
                      {item.product.price > 0 && (
                        <p className="text-sm text-primary font-bold mt-1">
                          {item.product.price} {item.product.currency}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded bg-background hover:bg-primary/10 text-white flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded bg-background hover:bg-primary/10 text-white flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-3">
              {getTotalPrice() > 0 && (
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">الإجمالي:</span>
                  <span className="text-primary">{getTotalPrice().toLocaleString('ar-SA')} ريال</span>
                </div>
              )}
              <button
                onClick={handleWhatsAppOrder}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>إرسال الطلب عبر واتساب</span>
                <span>📱</span>
              </button>
              <button onClick={clearCart} className="btn-secondary w-full text-sm">
                إفراغ السلة
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
