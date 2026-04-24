'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Tables } from '@/lib/types/database';

type Fasilitas = Tables<'fasilitas'>;
import { filterFasilitas, addDistanceToFacilities, type RadiusOption } from '@/lib/utils/filters';
import { formatDistance } from '@/lib/utils/haversine';
import { getCategoryColor, WISATA_MARKER_COLOR } from '@/lib/utils/colors';

// Dynamic import of Leaflet components with SSR disabled
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

interface FasilitasMapProps {
  wisataLat: number;
  wisataLng: number;
  wisataNama: string;
  fasilitasData: Fasilitas[];
  selectedRadius: RadiusOption;
  selectedKategori: string[];
  onRadiusChange: (radius: RadiusOption) => void;
  onKategoriChange: (kategori: string[]) => void;
}

export default function FasilitasMap({
  wisataLat,
  wisataLng,
  wisataNama,
  fasilitasData,
  selectedRadius,
  selectedKategori,
  onRadiusChange,
  onKategoriChange,
}: FasilitasMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
    
    // Load Leaflet CSS and create custom icons
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css');
        
        // Import Leaflet and fix default markers
        const L = await import('leaflet');
        
        // Fix default markers (Leaflet issue with webpack)
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

  // Filter facilities based on current selections
  const filteredFasilitas = useMemo(() => {
    const filtered = filterFasilitas(
      fasilitasData,
      wisataLat,
      wisataLng,
      selectedRadius,
      selectedKategori
    );
    
    // Add distance to each facility for popup display
    return addDistanceToFacilities(filtered, wisataLat, wisataLng);
  }, [fasilitasData, wisataLat, wisataLng, selectedRadius, selectedKategori]);

  // Create custom marker icons
  const createCustomIcon = useMemo(() => {
    if (!leafletLoaded || typeof window === 'undefined') return null;
    
    return async (color: string, isWisata: boolean = false) => {
      const L = await import('leaflet');
      
      const size = isWisata ? 35 : 25;
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: ${isWisata ? '16px' : '12px'};
        ">
          ${isWisata ? '★' : '●'}
        </div>
      `;
      
      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };
  }, [leafletLoaded]);

  // Don't render until client-side and Leaflet is loaded
  if (!isClient || !leafletLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[wisataLat, wisataLng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        className="focus:outline-none"
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* Radius circle if radius is selected */}
        {selectedRadius && (
          <Circle
            center={[wisataLat, wisataLng]}
            radius={selectedRadius}
            pathOptions={{
              color: '#1D4ED8',
              fillColor: '#1D4ED8',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}
        
        {/* Wisata marker */}
        <WisataMarker
          lat={wisataLat}
          lng={wisataLng}
          nama={wisataNama}
          createIcon={createCustomIcon}
        />
        
        {/* Facility markers */}
        {filteredFasilitas.map((facility) => (
          <FacilityMarker
            key={facility.id}
            facility={facility}
            createIcon={createCustomIcon}
          />
        ))}
      </MapContainer>
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
        <div className="text-center">
          <h3 className="font-semibold text-blue-700">{nama}</h3>
          <p className="text-sm text-gray-600">Destinasi Wisata</p>
        </div>
      </Popup>
    </Marker>
  );
}

// Facility marker component
function FacilityMarker({
  facility,
  createIcon,
}: {
  facility: Fasilitas & { distance: number };
  createIcon: any;
}) {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    if (createIcon) {
      const color = getCategoryColor(facility.kategori);
      createIcon(color, false).then(setIcon);
    }
  }, [createIcon, facility.kategori]);

  if (!icon) return null;

  return (
    <Marker position={[facility.latitude, facility.longitude]} icon={icon}>
      <Popup>
        <div className="min-w-48">
          <h4 className="font-semibold text-gray-800 mb-1">{facility.nama}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getCategoryColor(facility.kategori) }}
              ></span>
              <span className="text-gray-600">{facility.kategori}</span>
            </div>
            <div className="text-gray-500">
              Jarak: {formatDistance(facility.distance)}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}