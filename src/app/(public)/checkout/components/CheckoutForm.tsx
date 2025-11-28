'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from 'react-hot-toast';

export default function CheckoutForm() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const createOrder = useCreateOrder();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('السلة فارغة');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                items: items.map(item => ({
                    product_id: item.product.id,
                    product_name: item.product.name_ar || item.product.name || 'منتج',
                    quantity: item.quantity,
                    price: item.product.price,
                    total: item.product.price * item.quantity
                })),
                subtotal: getTotalPrice(),
                total: getTotalPrice(), // + shipping later
                status: 'pending' as const,
                notes: formData.address + (formData.notes ? ` - ملاحظات: ${formData.notes}` : '')
            };

            await createOrder.mutateAsync(orderData);

            toast.success('تم استلام طلبك بنجاح!');
            clearCart();
            router.push('/'); // Or to a success page
        } catch (error) {
            console.error('Order error:', error);
            toast.error('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">بيانات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-text-secondary mb-1">الاسم الكامل</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-secondary mb-1">رقم الهاتف</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                        dir="ltr"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary mb-1">البريد الإلكتروني</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary mb-1">العنوان</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field w-full h-24"
                        required
                        placeholder="المدينة، الحي، الشارع، وصف المنزل..."
                    ></textarea>
                </div>
            </div>
        </form>
    );
}
