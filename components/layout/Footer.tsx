'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-primary text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold">GeoTrip</h3>
            <p className="text-white/80 leading-relaxed text-sm">
              Platform WebGIS untuk menjelajahi destinasi wisata terbaik di Kota Semarang dengan informasi lengkap dan peta interaktif.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Navigasi</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Home
              </Link>
              <Link
                href="/znek"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                ZNEK
              </Link>
              <Link
                href="/wisata/d4d3f22b-6a42-421a-a9b1-9c0b025845ae"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Umbul Sidomukti
              </Link>
              <Link
                href="/wisata/e0430c98-0fce-4597-a593-077f723658a4"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Sam Poo Kong
              </Link>
              <Link
                href="/fasilitas"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Fasilitas
              </Link>
            </nav>
          </div>

          {/* Kolom 3: Kontak & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Kontak</h4>
            <div className="space-y-3 text-sm text-white/80">
              <p>Kota Semarang, Jawa Tengah</p>
              <p>Indonesia</p>
              <p className="pt-2">
                <a
                  href="mailto:info@geotrip.id"
                  className="hover:text-white transition-colors duration-300"
                >
                  info@geotrip.id
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {currentYear} GeoTrip. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
