'use client';

export default function CheckoutForm() {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">بيانات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-text-secondary mb-1">الاسم الكامل</label>
                    <input type="text" className="input-field w-full" required />
                </div>
                <div>
                    <label className="block text-sm text-text-secondary mb-1">رقم الهاتف</label>
                    <input type="tel" className="input-field w-full" required dir="ltr" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary mb-1">البريد الإلكتروني</label>
                    <input type="email" className="input-field w-full" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary mb-1">العنوان</label>
                    <textarea className="input-field w-full h-24" required></textarea>
                </div>
            </div>
        </div>
    );
}
