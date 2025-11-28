'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/catalog', label: 'جميع المنتجات' },
    { href: '/motorcycles', label: 'دراجات نارية' },
    { href: '/parking', label: 'مواقف' },
    { href: '/contact', label: 'تواصل' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
              <Image
                src="/Logo.png"
                alt="سوفت 99"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none group-hover:text-primary transition-colors">سوفت 99</span>
              <span className="text-[10px] text-text-muted tracking-wider">SOFT NINETY NINE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Google Maps Button */}
            <a
              href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-text-secondary hover:bg-primary/20 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
              aria-label="موقع المحل على الخريطة"
              title="موقع المحل على الخريطة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>

            {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-text-secondary hover:bg-primary/20 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
            aria-label={`فتح سلة التسوق، ${getTotalItems()} عناصر`}
            aria-expanded={isCartOpen}
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-background shadow-lg animate-in zoom-in">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white transition-all border border-white/5"
              aria-label="القائمة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden py-4 border-t border-white/10 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://maps.app.goo.gl/t6pyLPj52d18BaPH6?g_st=ipc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
            >
              <span>📍</span>
              <span>موقع المحل على الخريطة</span>
            </a>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {mounted && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </nav>
  );
}
