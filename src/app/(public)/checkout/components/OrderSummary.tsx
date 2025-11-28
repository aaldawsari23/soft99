'use client';

import { useCart } from '@/contexts/CartContext';

export default function OrderSummary() {
    const { items, getTotalPrice } = useCart();
    const total = getTotalPrice();

    return (
        <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">ملخص الطلب</h3>
            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-1 rounded text-xs">{item.quantity}x</span>
                            <span className="text-text-secondary">{item.product.name_ar}</span>
                        </div>
                        <span className="text-white font-medium">{(item.product.price * item.quantity).toLocaleString('ar-SA')} ريال</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-text-secondary">
                    <span>المجموع الفرعي</span>
                    <span>{total.toLocaleString('ar-SA')} ريال</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                    <span>الشحن</span>
                    <span>يحدد لاحقاً</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                    <span>الإجمالي</span>
                    <span className="text-primary">{total.toLocaleString('ar-SA')} ريال</span>
                </div>
            </div>
        </div>
    );
}
