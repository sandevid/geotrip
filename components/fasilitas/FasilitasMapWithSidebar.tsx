'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { Tables } from '@/lib/types/database';
import { filterByRadius, addDistanceToFacilities, sortByDistance } from '@/lib/utils/filters';
import { formatDistance } from '@/lib/utils/haversine';
import { getCategoryColor, getCategoryIcon, WISATA_MARKER_COLOR } from '@/lib/utils/colors';

// Dynamic import Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

interface FasilitasMapWithSidebarProps {
  fasilitasData: Tables<'fasilitas'>[];
  wisataData: Tables<'wisata'>[];
}

export default function FasilitasMapWithSidebar({
  fasilitasData,
  wisataData,
}: FasilitasMapWithSidebarProps) {
  const [selectedWisata, setSelectedWisata] = useState<Tables<'wisata'> | null>(
    wisataData[0] || null
  );
  const [radiusMeters, setRadiusMeters] = useState<number>(3000);
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [markerRefs, setMarkerRefs] = useState<Record<string, any>>({});

  useEffect(() => {
    setIsClient(true);
    
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        await import('leaflet/dist/leaflet.css');
        const L = await import('leaflet');
        
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });
        
        setLeafletLoaded(true);
      }
    };
    
    loadLeaflet();
  }, []);

  // Filter dan sort fasilitas
  const filteredAndSortedFasilitas = useMemo(() => {
    if (!selectedWisata) return [];
    
    const filtered = filterByRadius(
      fasilitasData,
      selectedWisata.latitude,
      selectedWisata.longitude,
      radiusMeters
    );
    
    const withDistance = addDistanceToFacilities(
      filtered,
      selectedWisata.latitude,
      selectedWisata.longitude
    );
    
    return sortByDistance(withDistance, true);
  }, [fasilitasData, selectedWisata, radiusMeters]);

  // Create custom icons with emoji
  const createCustomIcon = useMemo(() => {
    if (!leafletLoaded || typeof window === 'undefined') return null;
    
    return async (color: string, isWisata: boolean = false, icon: string = '') => {
      const L = await import('leaflet');
      
      const size = isWisata ? 40 : 32;
      const iconHtml = `
        <div class="marker-container" style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
        ">
          <div class="marker-inner" style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: ${isWisata ? '18px' : '16px'};
            transition: all 0.3s ease;
          ">
            ${isWisata ? '★' : icon}
          </div>
        </div>
      `;
      
      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };
  }, [leafletLoaded]);

  // Handle marker ready callback
  const handleMarkerReady = useCallback((id: string, marker: any) => {
    setMarkerRefs(prev => {
      // Only update if marker is different
      if (prev[id] === marker) return prev;
      return { ...prev, [id]: marker };
    });
  }, []);

  // Handle facility click - focus on map and open popup
  const handleFacilityClick = useCallback((facility: Tables<'fasilitas'> & { distance: number }) => {
    if (!mapInstance) {
      console.log('Map instance not ready');
      return;
    }
    
    console.log('Clicking facility:', facility.nama, 'ID:', facility.id);
    console.log('Available markers:', Object.keys(markerRefs));
    
    // Pan and zoom to facility
    mapInstance.setView([facility.latitude, facility.longitude], 17, {
      animate: true,
      duration: 0.5,
    });
    
    setSelectedFacilityId(facility.id);
    
    // Try to open popup immediately and after delay
    const tryOpenPopup = () => {
      const marker = markerRefs[facility.id];
      console.log('Trying to open popup for:', facility.id, 'Marker:', marker);
      
      if (marker) {
        try {
          if (typeof marker.openPopup === 'function') {
            marker.openPopup();
            console.log('Popup opened successfully');
          } else {
            console.log('openPopup is not a function', marker);
          }
        } catch (error) {
          console.error('Error opening popup:', error);
        }
      } else {
        console.log('Marker not found in refs');
      }
    };
    
    // Try immediately
    tryOpenPopup();
    
    // Try again after animation
    setTimeout(tryOpenPopup, 600);
    
    // Close mobile panels after selection
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
      setIsMobileListOpen(false);
    }
  }, [mapInstance, markerRefs]);

  // Auto pan to wisata when changed
  useEffect(() => {
    if (mapInstance && selectedWisata) {
      mapInstance.setView([selectedWisata.latitude, selectedWisata.longitude], 14, {
        animate: true,
        duration: 1,
      });
    }
  }, [mapInstance, selectedWisata]);

  if (!isClient || !leafletLoaded || !selectedWisata) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-gray-50">
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[selectedWisata.latitude, selectedWisata.longitude]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          ref={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          
          {/* Radius circle */}
          <Circle
            center={[selectedWisata.latitude, selectedWisata.longitude]}
            radius={radiusMeters}
            pathOptions={{
              color: '#0F172A',
              fillColor: '#0F172A',
              fillOpacity: 0.05,
              weight: 1.5,
            }}
          />
          
          {/* Wisata marker */}
          <WisataMarker
            lat={selectedWisata.latitude}
            lng={selectedWisata.longitude}
            nama={selectedWisata.nama}
            createIcon={createCustomIcon}
          />
          
          {/* Facility markers */}
          {filteredAndSortedFasilitas.map((facility) => (
            <FacilityMarker
              key={facility.id}
              facility={facility}
              createIcon={createCustomIcon}
              isSelected={selectedFacilityId === facility.id}
              onMarkerReady={handleMarkerReady}
            />
          ))}
        </MapContainer>
      </div>

      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden absolute top-6 left-4 right-4 z-[1001] flex justify-between gap-2 pointer-events-auto">
        {/* Filter Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
            setIsMobileListOpen(false);
          }}
          className={`bg-white rounded-full p-3 shadow-lg transition-colors ${
            isMobileSidebarOpen ? 'bg-primary text-white' : 'text-primary'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </motion.button>

        {/* List Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => {
            setIsMobileListOpen(!isMobileListOpen);
            setIsMobileSidebarOpen(false);
          }}
          className={`bg-white rounded-full p-3 shadow-lg transition-colors relative ${
            isMobileListOpen ? 'bg-primary text-white' : 'text-primary'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {filteredAndSortedFasilitas.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {filteredAndSortedFasilitas.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Left Sidebar - Filters */}
      <motion.div 
        initial={{ opacity: 0, x: -300 }}
        animate={{ 
          opacity: isMobileSidebarOpen ? 1 : 0,
          x: isMobileSidebarOpen ? 0 : -300,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`lg:hidden absolute top-20 left-0 right-0 z-[1000] bg-white rounded-b-3xl shadow-2xl max-h-[70vh] overflow-y-auto pointer-events-auto ${
          isMobileSidebarOpen ? 'block' : 'hidden'
        }`}
        style={{ boxShadow: '0 8px 24px 0 rgb(0 0 0 / 0.12)' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-primary">
              Filter Pencarian
            </h2>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Wisata Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Destinasi Wisata
            </label>
            <select
              value={selectedWisata.id}
              onChange={(e) => {
                const wisata = wisataData.find(w => w.id === e.target.value);
                setSelectedWisata(wisata || null);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all duration-300 text-sm"
            >
              {wisataData.map((wisata) => (
                <option key={wisata.id} value={wisata.id}>
                  {wisata.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">
                Radius Pencarian
              </label>
              <span className="text-sm font-semibold text-accent">
                {radiusMeters < 1000 ? `${radiusMeters}m` : `${(radiusMeters / 1000).toFixed(1)}km`}
              </span>
            </div>
            
            <div className="relative mb-3">
              <input
                type="range"
                min="250"
                max="5000"
                step="250"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #CBA35C 0%, #CBA35C ${((radiusMeters - 250) / (5000 - 250)) * 100}%, #E5E7EB ${((radiusMeters - 250) / (5000 - 250)) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
            
            {/* Quick radius buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 3000].map((radius) => (
                <motion.button
                  key={radius}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRadiusMeters(radius)}
                  className={`px-2 py-2 text-xs rounded-lg font-medium transition-all duration-300 ${
                    radiusMeters === radius
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600'
                  }`}
                >
                  {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Facility Count */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
              Fasilitas ditemukan
            </div>
            <div className="text-3xl font-bold text-primary">
              {filteredAndSortedFasilitas.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop Left Sidebar - Filters */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-6 z-[1000] bg-white rounded-2xl shadow-lg w-80 xl:w-96 max-h-[calc(100vh-8rem)] overflow-y-auto pointer-events-auto"
        style={{ boxShadow: '0 4px 16px 0 rgb(0 0 0 / 0.06)' }}
      >
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-primary mb-4 md:mb-6">
            Jelajahi Fasilitas
          </h2>
          
          {/* Wisata Selector */}
          <div className="mb-4 md:mb-6">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
              Destinasi Wisata
            </label>
            <select
              value={selectedWisata.id}
              onChange={(e) => {
                const wisata = wisataData.find(w => w.id === e.target.value);
                setSelectedWisata(wisata || null);
              }}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all duration-300 hover:border-accent text-xs md:text-sm"
            >
              {wisataData.map((wisata) => (
                <option key={wisata.id} value={wisata.id}>
                  {wisata.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Slider */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Radius Pencarian
              </label>
              <span className="text-xs md:text-sm font-semibold text-accent">
                {radiusMeters < 1000 ? `${radiusMeters}m` : `${(radiusMeters / 1000).toFixed(1)}km`}
              </span>
            </div>
            
            <div className="relative mb-3 md:mb-4">
              <input
                type="range"
                min="250"
                max="5000"
                step="250"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #CBA35C 0%, #CBA35C ${((radiusMeters - 250) / (5000 - 250)) * 100}%, #E5E7EB ${((radiusMeters - 250) / (5000 - 250)) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
            
            {/* Quick radius buttons */}
            <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-2 md:mb-3">
              {[500, 1000, 2000, 3000].map((radius) => (
                <motion.button
                  key={radius}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRadiusMeters(radius)}
                  className={`px-1.5 md:px-2 py-1.5 md:py-2 text-[10px] md:text-xs rounded-lg font-medium transition-all duration-300 ${
                    radiusMeters === radius
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
                  }`}
                >
                  {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
                </motion.button>
              ))}
            </div>
          </div>

          <style jsx global>{`
            .slider-thumb::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #CBA35C;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              transition: all 0.3s ease;
            }
            
            .slider-thumb::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            }
            
            .slider-thumb::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #CBA35C;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
              transition: all 0.3s ease;
            }
            
            .slider-thumb::-moz-range-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            }
            
            .leaflet-container {
              z-index: 0 !important;
            }
            
            .custom-marker-icon {
              background: transparent !important;
              border: none !important;
            }
            
            .custom-marker-icon:hover .marker-inner {
              transform: scale(1.1);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .leaflet-popup-content-wrapper {
              border-radius: 12px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            }
            
            .leaflet-popup-tip {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          `}</style>

          {/* Facility Count */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-5 border border-gray-100">
            <div className="text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wide">
              Fasilitas ditemukan
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {filteredAndSortedFasilitas.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Sidebar - Facility List - Hidden on mobile, visible on tablet+ */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden lg:flex absolute top-6 right-4 md:right-6 z-[1000] bg-white rounded-2xl shadow-lg w-80 xl:w-96 max-h-[calc(100vh-8rem)] overflow-hidden flex-col pointer-events-auto"
        style={{ boxShadow: '0 4px 16px 0 rgb(0 0 0 / 0.06)' }}
      >
        <div className="p-4 md:p-5 border-b border-gray-100 bg-white">
          <h3 className="font-heading font-semibold text-base md:text-lg text-primary">Daftar Fasilitas</h3>
          <p className="text-xs text-gray-500 mt-1">
            Dalam radius {radiusMeters < 1000 ? `${radiusMeters}m` : `${(radiusMeters / 1000).toFixed(1)}km`}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredAndSortedFasilitas.length === 0 ? (
            <div className="p-6 md:p-8 text-center text-gray-500">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm font-medium">Tidak ada fasilitas</p>
              <p className="text-[10px] md:text-xs mt-1">Coba perbesar radius pencarian</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredAndSortedFasilitas.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group mb-2 p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 hover:-translate-y-0.5"
                  style={{
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px 0 rgb(0 0 0 / 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 0)';
                  }}
                  onClick={() => handleFacilityClick(facility)}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="text-lg md:text-xl flex-shrink-0 mt-0.5">
                      {getCategoryIcon(facility.kategori)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-xs md:text-sm truncate group-hover:text-primary transition-colors duration-300">
                        {facility.nama}
                      </h4>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
                        {facility.kategori}
                      </p>
                      <p className="text-[10px] md:text-xs text-accent font-medium mt-1 md:mt-2">
                        {formatDistance(facility.distance)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Bottom Sheet - Facility List */}
      <motion.div
        initial={{ y: 500 }}
        animate={{ 
          y: isMobileListOpen ? 0 : 500,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col pointer-events-auto ${
          isMobileListOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-base text-primary">Daftar Fasilitas</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredAndSortedFasilitas.length} fasilitas dalam radius {radiusMeters < 1000 ? `${radiusMeters}m` : `${(radiusMeters / 1000).toFixed(1)}km`}
              </p>
            </div>
            <button
              onClick={() => setIsMobileListOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredAndSortedFasilitas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Tidak ada fasilitas</p>
              <p className="text-xs mt-1">Coba perbesar radius pencarian</p>
            </div>
          ) : (
            <div className="p-3">
              {filteredAndSortedFasilitas.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={`mb-2 p-3 rounded-xl transition-all duration-300 cursor-pointer border ${
                    selectedFacilityId === facility.id
                      ? 'bg-accent/10 border-accent shadow-md'
                      : 'border-transparent hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  onClick={() => handleFacilityClick(facility)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getCategoryIcon(facility.kategori)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">
                        {facility.nama}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: getCategoryColor(facility.kategori) }}
                        />
                        <p className="text-xs text-gray-500">
                          {facility.kategori}
                        </p>
                      </div>
                      <p className="text-xs text-accent font-medium mt-1.5">
                        📍 {formatDistance(facility.distance)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Wisata marker component
function WisataMarker({
  lat,
  lng,
  nama,
  createIcon,
}: {
  lat: number;
  lng: number;
  nama: string;
  createIcon: any;
}) {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    if (createIcon) {
      createIcon(WISATA_MARKER_COLOR, true).then(setIcon);
    }
  }, [createIcon]);

  if (!icon) return null;

  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <div className="text-center p-2">
          <h3 className="font-heading font-semibold text-primary text-base mb-1">{nama}</h3>
          <p className="text-xs text-gray-500">Destinasi Wisata</p>
        </div>
      </Popup>
    </Marker>
  );
}

// Facility marker component with forwardRef
const FacilityMarker = React.memo(({
  facility,
  createIcon,
  isSelected,
  onMarkerReady,
}: {
  facility: Tables<'fasilitas'> & { distance: number };
  createIcon: any;
  isSelected: boolean;
  onMarkerReady?: (id: string, marker: any) => void;
}) => {
  const [icon, setIcon] = useState<any>(null);
  const markerRef = useRef<any>(null);
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (createIcon) {
      const color = getCategoryColor(facility.kategori);
      const iconEmoji = getCategoryIcon(facility.kategori);
      createIcon(color, false, iconEmoji).then(setIcon);
    }
  }, [createIcon, facility.kategori]);

  // Register marker when it's ready
  const handleMarkerMount = useCallback((marker: any) => {
    if (marker && !hasRegistered.current) {
      markerRef.current = marker;
      if (onMarkerReady) {
        onMarkerReady(facility.id, marker);
      }
      hasRegistered.current = true;
    }
  }, [facility.id, onMarkerReady]);

  if (!icon) return null;

  return (
    <Marker 
      ref={handleMarkerMount}
      position={[facility.latitude, facility.longitude]} 
      icon={icon}
      eventHandlers={{
        add: (e: any) => {
          // Marker is added to map, save reference
          if (e.target && !hasRegistered.current) {
            handleMarkerMount(e.target);
          }
        }
      }}
    >
      <Popup>
        <div className="min-w-[200px] p-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getCategoryIcon(facility.kategori)}</span>
            <h4 className="font-semibold text-primary text-sm flex-1">{facility.nama}</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full border border-white shadow-sm" 
                style={{ backgroundColor: getCategoryColor(facility.kategori) }}
              ></span>
              <span className="text-gray-600">{facility.kategori}</span>
            </div>
            <div className="flex items-center gap-2 text-accent font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formatDistance(facility.distance)}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

FacilityMarker.displayName = 'FacilityMarker';