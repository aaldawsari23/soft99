'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white hover:border-white/20 transition-colors"
      >
        <span className="text-neutral-400">{label}:</span>
        <span>{selectedOption?.label || 'الكل'}</span>
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-xl z-20 py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2 text-right text-sm transition-colors ${
              value === 'all' ? 'text-red-500 bg-red-500/10' : 'text-neutral-300 hover:bg-white/5'
            }`}
          >
            الكل
          </button>
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => { onChange(option.id); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-right text-sm transition-colors ${
                value === option.id ? 'text-red-500 bg-red-500/10' : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
