'use client';

import { getCategoryColorList, WISATA_MARKER_COLOR } from '@/lib/utils/colors';
import { FACILITY_CATEGORIES } from '@/lib/utils/filters';

interface LegendKategoriProps {
  className?: string;
  showWisataLegend?: boolean;
}

export default function LegendKategori({ 
  className = '', 
  showWisataLegend = true 
}: LegendKategoriProps) {
  const categoryColors = getCategoryColorList();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">
        Legenda Peta
      </h3>
      
      <div className="space-y-2">
        {/* Wisata legend */}
        {showWisataLegend && (
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm text-white text-xs font-bold"
                 style={{ backgroundColor: WISATA_MARKER_COLOR }}>
              ★
            </div>
            <span className="text-sm text-gray-700 font-medium">
              Destinasi Wisata
            </span>
          </div>
        )}
        
        {/* Facility categories legend */}
        <div className="space-y-1.5">
          {FACILITY_CATEGORIES.map((category) => {
            const colorData = categoryColors.find(c => c.category === category);
            if (!colorData) return null;
            
            return (
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: colorData.color }}
                  title={`Fasilitas ${category}`}
                />
                <span className="text-sm text-gray-600 truncate">
                  {category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend footer */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Klik marker untuk detail fasilitas
        </p>
      </div>
    </div>
  );
}

// Compact version for mobile
export function LegendKategoriCompact({ className = '' }: { className?: string }) {
  const categoryColors = getCategoryColorList();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-xs">
        Legenda
      </h4>
      
      {/* Wisata */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white shadow-sm text-white text-xs font-bold"
             style={{ backgroundColor: WISATA_MARKER_COLOR }}>
          ★
        </div>
        <span className="text-xs text-gray-700">Wisata</span>
      </div>
      
      {/* Categories in grid */}
      <div className="grid grid-cols-2 gap-1">
        {FACILITY_CATEGORIES.slice(0, 8).map((category) => {
          const colorData = categoryColors.find(c => c.category === category);
          if (!colorData) return null;
          
          return (
            <div key={category} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: colorData.color }}
              />
              <span className="text-xs text-gray-600 truncate">
                {category}
              </span>
            </div>
          );
        })}
      </div>
      
      {FACILITY_CATEGORIES.length > 8 && (
        <div className="mt-1 text-xs text-gray-500">
          +{FACILITY_CATEGORIES.length - 8} lainnya
        </div>
      )}
    </div>
  );
}