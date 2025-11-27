'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={twMerge("flex border-b border-border", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative",
                        activeTab === tab.id
                            ? "text-primary"
                            : "text-text-secondary hover:text-text hover:bg-white/5"
                    )}
                >
                    {tab.icon && <span className="text-lg">{tab.icon}</span>}
                    {tab.label}
                    {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
