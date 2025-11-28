import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
            >
              تخطي إلى المحتوى الرئيسي
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
        </ToastProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}
