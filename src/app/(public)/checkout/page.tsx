'use client';

import CheckoutForm from './components/CheckoutForm';
import OrderSummary from './components/OrderSummary';
import PaymentSection from './components/PaymentSection';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
    const { items } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items, router]);

    if (items.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="section-title mb-8">إتمام الطلب</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card p-6">
                        <CheckoutForm />
                    </div>
                    <div className="card p-6">
                        <PaymentSection />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <OrderSummary />
                    <button
                        form="checkout-form"
                        type="submit"
                        className="btn-primary w-full mt-4 text-lg"
                    >
                        تأكيد الطلب
                    </button>
                </div>
            </div>
        </div>
    );
}
