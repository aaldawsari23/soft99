'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminHeaderProps {
    title?: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="lg:hidden sticky top-0 z-30 h-14 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 px-4 flex items-center gap-3">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white"
                    aria-label="القائمة"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {title && <h1 className="text-white font-bold">{title}</h1>}
            </header>

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </>
    );
}
