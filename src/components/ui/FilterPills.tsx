'use client';

import { useState } from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
  showAll?: boolean;
}

export default function FilterPills({
  options,
  selected,
  onChange,
  label,
  showAll = true
}: FilterPillsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show first 5 items initially, rest on expand
  const displayOptions = isExpanded ? options : options.slice(0, 5);
  const hasMore = options.length > 5;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {/* All option */}
        {showAll && (
          <button
            onClick={() => onChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selected === 'all'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            الكل
          </button>
        )}

        {/* Options */}
        {displayOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selected === option.id
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}

        {/* Show More/Less Button */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
          >
            {isExpanded ? 'أقل ←' : `${options.length - 5}+ المزيد`}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Mobile horizontal scrollable filter pills
 */
interface MobileFilterPillsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
  showAll?: boolean;
}

export function MobileFilterPills({
  options,
  selected,
  onChange,
  showAll = true
}: MobileFilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
      {showAll && (
        <button
          onClick={() => onChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 snap-start ${
            selected === 'all'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-white/5 text-neutral-400 border border-white/10'
          }`}
        >
          الكل
        </button>
      )}

      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 snap-start ${
            selected === option.id
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-white/5 text-neutral-400 border border-white/10'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Filter chip with remove button (for active filters)
 */
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 text-sm rounded-full border border-red-500/20">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-300 transition-colors"
        aria-label={`إزالة فلتر ${label}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
