"use client";

import Link from 'next/link';

export default function ParkingPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">مواقف آمنة للإيجار</h1>
            <p className="text-text-secondary text-lg">
              نوفر لك مساحات مخصصة وآمنة لحفظ دراجتك النارية بأسعار تناسب الجميع
            </p>
          </div>
          <div className="card space-y-8">
            {/* Rates */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">الأسعار</h2>
              <ul className="space-y-2 text-text-secondary text-lg">
                <li>السعر اليومي: <span className="text-green-500 font-semibold">30 ريال</span></li>
                <li>السعر الأسبوعي: <span className="text-green-500 font-semibold">150 ريال</span></li>
                <li>السعر الشهري: <span className="text-green-500 font-semibold">500 ريال</span></li>
              </ul>
            </div>
            {/* Booking */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">للاستفسار والحجز</h2>
              <p className="text-text-secondary mb-2">
                يرجى التواصل معنا عبر الواتساب للحجز أو طرح أي استفسار.
              </p>
              <a
                href="https://wa.me/966568663381"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary block w-full text-center py-3"
              >
                تواصل عبر واتساب
              </a>
            </div>
            {/* Terms */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">الشروط والأحكام</h2>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>أوقات عمل المحل لاستلام وتسليم الدراجات: يومياً من 5:30 عصراً حتى 3:00 فجراً.</li>
                <li>يجب أن تكون الدراجة في حالة تشغيل جيدة وغير مسربة للزيوت.</li>
                <li>الدفع مقدمًا ويشمل التأمين الأساسي على الدراجة.</li>
                <li>الأسعار قابلة للتغيير حسب الموسم أو الطلب.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}