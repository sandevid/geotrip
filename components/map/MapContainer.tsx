'use client';

import { useState, useMemo, useCallback } from 'react';
import FasilitasMap from './FasilitasMap';
import FilterRadius, { FilterRadiusCompact, FilterRadiusHorizontal } from './FilterRadius';
import FilterKategori, { FilterKategoriCompact, FilterKategoriChips } from './FilterKategori';
import LegendKategori, { LegendKategoriCompact } from './LegendKategori';
import type { Tables } from '@/lib/types/database';

type Fasilitas = Tables<'fasilitas'>;
import { 
  filterFasilitas, 
  getFacilityCountByRadius, 
  getFacilityCountByCategory,
  type RadiusOption 
} from '@/lib/utils/filters';

interface MapContainerProps {
  wisataLat: number;
  wisataLng: number;
  wisataNama: string;
  fasilitasData: Fasilitas[];
  className?: string;
}

export default function MapContainer({
  wisataLat,
  wisataLng,
  wisataNama,
  fasilitasData,
  className = '',
}: MapContainerProps) {
  // Filter state
  const [selectedRadius, setSelectedRadius] = useState<RadiusOption>(null);
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);

  // Memoized filtered results for performance
  const filteredFasilitas = useMemo(() => {
    return filterFasilitas(
      fasilitasData,
      wisataLat,
      wisataLng,
      selectedRadius,
      selectedKategori
    );
  }, [fasilitasData, wisataLat, wisataLng, selectedRadius, selectedKategori]);

  // Memoized facility counts for filter displays
  const radiusCounts = useMemo(() => {
    return getFacilityCountByRadius(
      fasilitasData,
      wisataLat,
      wisataLng,
      selectedKategori
    );
  }, [fasilitasData, wisataLat, wisataLng, selectedKategori]);

  const categoryCounts = useMemo(() => {
    return getFacilityCountByCategory(
      fasilitasData,
      wisataLat,
      wisataLng,
      selectedRadius
    );
  }, [fasilitasData, wisataLat, wisataLng, selectedRadius]);

  // Filter change handlers
  const handleRadiusChange = useCallback((radius: RadiusOption) => {
    setSelectedRadius(radius);
  }, []);

  const handleKategoriChange = useCallback((kategori: string[]) => {
    setSelectedKategori(kategori);
  }, []);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSelectedRadius(null);
    setSelectedKategori([]);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Controls - Responsive Layout */}
      <div className="space-y-4">
        {/* Desktop Filters */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <FilterRadius
            selectedRadius={selectedRadius}
            onRadiusChange={handleRadiusChange}
            facilityCounts={radiusCounts}
          />
          
          <FilterKategori
            selectedKategori={selectedKategori}
            onKategoriChange={handleKategoriChange}
            facilityCounts={categoryCounts}
          />
        </div>

        {/* Tablet Filters */}
        <div className="hidden md:block lg:hidden space-y-3">
          <FilterRadiusHorizontal
            selectedRadius={selectedRadius}
            onRadiusChange={handleRadiusChange}
            facilityCounts={radiusCounts}
          />
          
          <FilterKategoriChips
            selectedKategori={selectedKategori}
            onKategoriChange={handleKategoriChange}
            facilityCounts={categoryCounts}
          />
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          <FilterRadiusCompact
            selectedRadius={selectedRadius}
            onRadiusChange={handleRadiusChange}
            facilityCounts={radiusCounts}
          />
          
          <FilterKategoriCompact
            selectedKategori={selectedKategori}
            onKategoriChange={handleKategoriChange}
            facilityCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Filter Summary and Reset */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
        <div className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold text-gray-800">{filteredFasilitas.length}</span> fasilitas
          {selectedRadius && (
            <span> dalam radius {selectedRadius < 1000 ? `${selectedRadius}m` : `${selectedRadius/1000}km`}</span>
          )}
          {selectedKategori.length > 0 && (
            <span> untuk {selectedKategori.length} kategori</span>
          )}
        </div>
        
        {(selectedRadius !== null || selectedKategori.length > 0) && (
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Map and Legend Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map */}
        <div className="xl:col-span-3">
          <FasilitasMap
            wisataLat={wisataLat}
            wisataLng={wisataLng}
            wisataNama={wisataNama}
            fasilitasData={fasilitasData}
            selectedRadius={selectedRadius}
            selectedKategori={selectedKategori}
            onRadiusChange={handleRadiusChange}
            onKategoriChange={handleKategoriChange}
          />
        </div>
        
        {/* Legend - Desktop */}
        <div className="hidden xl:block">
          <LegendKategori />
        </div>
        
        {/* Legend - Mobile/Tablet */}
        <div className="xl:hidden">
          <LegendKategoriCompact />
        </div>
      </div>

      {/* Mobile Filter Stats */}
      <div className="lg:hidden bg-blue-50 rounded-lg p-3">
        <h4 className="font-medium text-blue-800 mb-2 text-sm">
          Statistik Fasilitas
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-blue-600">Total:</span>
            <span className="font-semibold ml-1">{fasilitasData.length}</span>
          </div>
          <div>
            <span className="text-blue-600">Ditampilkan:</span>
            <span className="font-semibold ml-1">{filteredFasilitas.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}