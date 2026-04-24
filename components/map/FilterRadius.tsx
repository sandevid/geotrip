'use client';

import { RADIUS_OPTIONS, type RadiusOption } from '@/lib/utils/filters';

interface FilterRadiusProps {
  selectedRadius: RadiusOption;
  onRadiusChange: (radius: RadiusOption) => void;
  facilityCounts: Record<string, number>;
  className?: string;
}

export default function FilterRadius({
  selectedRadius,
  onRadiusChange,
  facilityCounts,
  className = '',
}: FilterRadiusProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">
        Filter Radius
      </h3>
      
      <div className="space-y-2">
        {RADIUS_OPTIONS.map(({ value, label }) => {
          const count = facilityCounts[label] || 0;
          const isSelected = selectedRadius === value;
          
          return (
            <label
              key={label}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="radius"
                  value={value || 'all'}
                  checked={isSelected}
                  onChange={() => onRadiusChange(value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                  {label}
                </span>
              </div>
              
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${isSelected 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {count}
              </span>
            </label>
          );
        })}
      </div>
      
      {/* Quick stats */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {selectedRadius === null ? (
            'Menampilkan semua fasilitas'
          ) : (
            `Dalam radius ${selectedRadius < 1000 ? `${selectedRadius}m` : `${selectedRadius/1000}km`}`
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function FilterRadiusCompact({
  selectedRadius,
  onRadiusChange,
  facilityCounts,
  className = '',
}: FilterRadiusProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-xs">
        Radius
      </h4>
      
      <select
        value={selectedRadius || 'all'}
        onChange={(e) => {
          const value = e.target.value === 'all' ? null : Number(e.target.value);
          onRadiusChange(value as RadiusOption);
        }}
        className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {RADIUS_OPTIONS.map(({ value, label }) => {
          const count = facilityCounts[label] || 0;
          return (
            <option key={label} value={value || 'all'}>
              {label} ({count})
            </option>
          );
        })}
      </select>
    </div>
  );
}

// Horizontal version for tablet
export function FilterRadiusHorizontal({
  selectedRadius,
  onRadiusChange,
  facilityCounts,
  className = '',
}: FilterRadiusProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-sm">
        Filter Radius
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {RADIUS_OPTIONS.map(({ value, label }) => {
          const count = facilityCounts[label] || 0;
          const isSelected = selectedRadius === value;
          
          return (
            <button
              key={label}
              onClick={() => onRadiusChange(value)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}