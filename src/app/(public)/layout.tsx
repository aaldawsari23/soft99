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
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
        </ToastProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}
