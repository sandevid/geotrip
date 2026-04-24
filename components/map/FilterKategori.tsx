'use client';

import { useState } from 'react';
import { FACILITY_CATEGORIES } from '@/lib/utils/filters';
import { getCategoryColor } from '@/lib/utils/colors';

interface FilterKategoriProps {
  selectedKategori: string[];
  onKategoriChange: (kategori: string[]) => void;
  facilityCounts: Record<string, number>;
  className?: string;
}

export default function FilterKategori({
  selectedKategori,
  onKategoriChange,
  facilityCounts,
  className = '',
}: FilterKategoriProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedKategori.includes(category)
      ? selectedKategori.filter(k => k !== category)
      : [...selectedKategori, category];
    
    onKategoriChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedKategori.length === FACILITY_CATEGORIES.length) {
      onKategoriChange([]);
    } else {
      onKategoriChange([...FACILITY_CATEGORIES]);
    }
  };

  const visibleCategories = isExpanded ? FACILITY_CATEGORIES : FACILITY_CATEGORIES.slice(0, 6);
  const hasMore = FACILITY_CATEGORIES.length > 6;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">
          Filter Kategori
        </h3>
        
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedKategori.length === FACILITY_CATEGORIES.length ? 'Hapus Semua' : 'Pilih Semua'}
        </button>
      </div>
      
      <div className="space-y-2">
        {visibleCategories.map((category) => {
          const count = facilityCounts[category] || 0;
          const isSelected = selectedKategori.includes(category);
          const color = getCategoryColor(category);
          
          return (
            <label
              key={category}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
                }
                ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category)}
                  disabled={count === 0}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                    {category}
                  </span>
                </div>
              </div>
              
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${isSelected 
                  ? 'bg-blue-100 text-blue-700' 
                  : count === 0
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }
              `}>
                {count}
              </span>
            </label>
          );
        })}
        
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? 'Tampilkan Lebih Sedikit' : `Tampilkan ${FACILITY_CATEGORIES.length - 6} Lainnya`}
          </button>
        )}
      </div>
      
      {/* Selection summary */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {selectedKategori.length === 0 ? (
            'Semua kategori ditampilkan'
          ) : (
            `${selectedKategori.length} dari ${FACILITY_CATEGORIES.length} kategori dipilih`
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function FilterKategoriCompact({
  selectedKategori,
  onKategoriChange,
  facilityCounts,
  className = '',
}: FilterKategoriProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedKategori.includes(category)
      ? selectedKategori.filter(k => k !== category)
      : [...selectedKategori, category];
    
    onKategoriChange(newSelection);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <h4 className="font-medium text-gray-800 text-xs">
          Kategori ({selectedKategori.length})
        </h4>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
          {FACILITY_CATEGORIES.map((category) => {
            const count = facilityCounts[category] || 0;
            const isSelected = selectedKategori.includes(category);
            const color = getCategoryColor(category);
            
            return (
              <label
                key={category}
                className={`
                  flex items-center justify-between p-1.5 rounded cursor-pointer text-xs
                  ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category)}
                    disabled={count === 0}
                    className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                  />
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate">{category}</span>
                </div>
                <span className="text-gray-500">({count})</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Horizontal chips version
export function FilterKategoriChips({
  selectedKategori,
  onKategoriChange,
  facilityCounts,
  className = '',
}: FilterKategoriProps) {
  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedKategori.includes(category)
      ? selectedKategori.filter(k => k !== category)
      : [...selectedKategori, category];
    
    onKategoriChange(newSelection);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-sm">
        Filter Kategori
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {FACILITY_CATEGORIES.map((category) => {
          const count = facilityCounts[category] || 0;
          const isSelected = selectedKategori.includes(category);
          const color = getCategoryColor(category);
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              disabled={count === 0}
              className={`
                flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors
                ${isSelected
                  ? 'bg-blue-600 text-white'
                  : count === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isSelected ? 'white' : color }}
              />
              {category} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}