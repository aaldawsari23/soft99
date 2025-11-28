'use client';

export default function PaymentSection() {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">طريقة الدفع</h3>
            <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input type="radio" name="payment" value="cod" className="w-5 h-5 text-primary" defaultChecked />
                    <div>
                        <div className="font-bold text-white">الدفع عند الاستلام</div>
                        <div className="text-sm text-text-secondary">ادفع نقداً عند استلام طلبك</div>
                    </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors opacity-50">
                    <input type="radio" name="payment" value="card" className="w-5 h-5 text-primary" disabled />
                    <div>
                        <div className="font-bold text-white">بطاقة ائتمان / مدى (قريباً)</div>
                        <div className="text-sm text-text-secondary">الدفع الآمن عبر البطاقة</div>
                    </div>
                </label>
            </div>
        </div>
    );
}
