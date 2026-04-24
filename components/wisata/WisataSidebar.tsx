'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Ticket } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

interface WisataSidebarProps {
  wisata: Tables<'wisata'>;
}

export function WisataSidebar({ wisata }: WisataSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-heading font-semibold text-primary mb-6">
        {wisata.nama}
      </h2>

      <div className="space-y-6">
        {/* Alamat */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Alamat
            </p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {wisata.alamat}
          </p>
        </div>

        {/* Jam Operasional */}
        {wisata.jam_buka && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Jam Operasional
              </p>
            </div>
            <p className="text-sm text-gray-700">{wisata.jam_buka}</p>
          </div>
        )}

        {/* Harga Tiket */}
        {wisata.harga_tiket && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-accent" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Harga Tiket
              </p>
            </div>
            <div className="space-y-2">
              {wisata.harga_tiket.split('\n').filter(line => line.trim()).map((line, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {line.trim()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Koordinat */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Koordinat</p>
          <p className="text-xs font-mono text-gray-600">
            {wisata.latitude.toFixed(6)}, {wisata.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
